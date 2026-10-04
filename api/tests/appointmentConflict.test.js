// Tests the appointment conflict rule in staffService without touching the real database.
// A small in-memory fake of Prisma applies the SAME "where" filter the service sends,
// so these tests check the real overlap logic (not just a canned answer).

jest.mock("../src/config/prisma", () => {
  const appointments = [];

  const matches = (a, where) => {
    if (where.id?.not !== undefined && a.id === where.id.not) return false;
    if (where.doctorId !== undefined && a.doctorId !== where.doctorId) return false;
    if (where.status?.not !== undefined && a.status === where.status.not) return false;
    if (where.startTime?.lt !== undefined && !(a.startTime < where.startTime.lt)) return false;
    if (where.endTime?.gt !== undefined && !(a.endTime > where.endTime.gt)) return false;
    return true;
  };

  return {
    __appointments: appointments,
    patient: { findUnique: jest.fn(async ({ where }) => ({ id: where.id })) },
    doctor: { findUnique: jest.fn(async ({ where }) => ({ id: where.id })) },
    appointment: {
      findFirst: jest.fn(async ({ where }) => appointments.find((a) => matches(a, where)) || null),
      findUnique: jest.fn(async ({ where }) => appointments.find((a) => a.id === where.id) || null),
      create: jest.fn(async ({ data }) => {
        const record = { id: `appt-${appointments.length + 1}`, ...data };
        appointments.push(record);
        return record;
      }),
      update: jest.fn(async ({ where, data }) => {
        const record = appointments.find((a) => a.id === where.id);
        Object.assign(record, data);
        return record;
      }),
    },
  };
});

const prisma = require("../src/config/prisma");
const staffService = require("../src/services/staffService");

const at = (time) => `2030-01-01T${time}:00.000Z`;

const book = (start, end, doctorId = "doc-1") =>
  staffService.createAppointment({
    patientId: "pat-1",
    doctorId,
    startTime: at(start),
    endTime: at(end),
  });

beforeEach(() => {
  prisma.__appointments.length = 0;
});

describe("create appointment - conflict rule", () => {
  test("books an appointment when the doctor is free", async () => {
    const result = await book("10:00", "10:30");
    expect(result.status).toBe("SCHEDULED");
  });

  test("rejects an overlapping appointment with 409", async () => {
    await book("10:00", "10:30");
    await expect(book("10:15", "10:45")).rejects.toMatchObject({ statusCode: 409 });
  });

  test("rejects an appointment fully inside an existing one", async () => {
    await book("10:00", "11:00");
    await expect(book("10:15", "10:30")).rejects.toMatchObject({ statusCode: 409 });
  });

  test("rejects an appointment that fully contains an existing one", async () => {
    await book("10:15", "10:30");
    await expect(book("10:00", "11:00")).rejects.toMatchObject({ statusCode: 409 });
  });

  test("allows back-to-back appointments", async () => {
    await book("10:00", "10:30");
    await expect(book("10:30", "11:00")).resolves.toBeDefined();
    await expect(book("09:30", "10:00")).resolves.toBeDefined();
  });

  test("allows the same time for a different doctor", async () => {
    await book("10:00", "10:30", "doc-1");
    await expect(book("10:00", "10:30", "doc-2")).resolves.toBeDefined();
  });

  test("a cancelled appointment does not block its slot", async () => {
    const first = await book("10:00", "10:30");
    first.status = "CANCELLED";
    await expect(book("10:00", "10:30")).resolves.toBeDefined();
  });

  test("rejects an end time that is not after the start time with 400", async () => {
    await expect(book("10:30", "10:00")).rejects.toMatchObject({ statusCode: 400 });
    await expect(book("10:00", "10:00")).rejects.toMatchObject({ statusCode: 400 });
  });
});

describe("reschedule appointment - conflict rule", () => {
  test("can move an appointment within its own slot (ignores itself)", async () => {
    const appt = await book("10:00", "10:30");
    await expect(
      staffService.updateAppointment(appt.id, {
        startTime: at("10:15"),
        endTime: at("10:45"),
      }),
    ).resolves.toBeDefined();
  });

  test("rejects rescheduling onto another appointment with 409", async () => {
    await book("10:00", "10:30");
    const second = await book("11:00", "11:30");
    await expect(
      staffService.updateAppointment(second.id, {
        startTime: at("10:15"),
        endTime: at("10:45"),
      }),
    ).rejects.toMatchObject({ statusCode: 409 });
  });

  test("allows rescheduling to a back-to-back slot", async () => {
    await book("10:00", "10:30");
    const second = await book("11:00", "11:30");
    await expect(
      staffService.updateAppointment(second.id, {
        startTime: at("10:30"),
        endTime: at("11:00"),
      }),
    ).resolves.toBeDefined();
  });

  test("cancelling skips the conflict check", async () => {
    await book("10:00", "10:30");
    const second = await book("11:00", "11:30");
    await expect(
      staffService.updateAppointment(second.id, {
        startTime: at("10:00"),
        endTime: at("10:30"),
        status: "CANCELLED",
      }),
    ).resolves.toBeDefined();
  });
}); 