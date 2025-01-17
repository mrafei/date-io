import "dayjs/locale/ru";
import "dayjs/locale/en";
import "moment/locale/en-au";
import dayjs from "dayjs";
import advancedDayJsFormat from "dayjs/plugin/advancedFormat";
import LuxonUtils from "../packages/luxon/src";
import { TEST_TIMESTAMP, utilsTest } from "./test-utils";
import DayjsUtils from "../packages/dayjs/src";
import ruLocale from "date-fns/locale/ru";
import enAuLocale from "date-fns/locale/en-AU";
import DateFnsUtils from "../packages/date-fns/src";
import MomentUtils from "../packages/moment/src";
import JsJodaUtils from "../packages/js-joda/src";
import {
  Locale
} from "@js-joda/locale";
import moment from "moment";
import {DateIOFormats} from "@date-io/core/IUtils";

describe("Localization helpers", () => {
  utilsTest("formatNumber", (date, utils) => {
    expect(utils.formatNumber("1")).toBe("1");
  });

  utilsTest("getMeridiemText", (date, utils) => {
    expect(utils.getMeridiemText("am")).toBe("AM");
    expect(utils.getMeridiemText("pm")).toBe("PM");
  });
});

describe("DateFns -- Localization", () => {
  const enAuDateFnsUtils = new DateFnsUtils({ locale: enAuLocale });
  const RuDateFnsUtils = new DateFnsUtils({ locale: ruLocale });

  it("Should return weekdays starting with monday", () => {
    const result = RuDateFnsUtils.getWeekdays();
    expect(result).toEqual(["пн", "вт", "ср", "чт", "пт", "сб", "вс"]);
  });

  it("is12HourCycleInCurrentLocale: properly determine should use meridiem or not", () => {
    expect(enAuDateFnsUtils.is12HourCycleInCurrentLocale()).toBe(true);
    expect(RuDateFnsUtils.is12HourCycleInCurrentLocale()).toBe(false);
    // default behavior
    expect(new DateFnsUtils().is12HourCycleInCurrentLocale()).toBe(true);
  });

  it("getCurrentLocaleCode: returns locale code", () => {
    expect(RuDateFnsUtils.getCurrentLocaleCode()).toBe("ru");
  });
  it("startOfWeek: returns correct start of week for locale", () => {
    expect(
      RuDateFnsUtils.formatByString(
        RuDateFnsUtils.startOfWeek(RuDateFnsUtils.date(TEST_TIMESTAMP)),
        "d"
      )
    ).toEqual("29");
  });
  it("endOfWeek: returns correct end of week for locale", () => {
    expect(
      RuDateFnsUtils.formatByString(
        RuDateFnsUtils.endOfWeek(RuDateFnsUtils.date(TEST_TIMESTAMP)),
        "d"
      )
    ).toEqual("4");
  });
});

describe("Luxon -- Localization", () => {
  describe("in English", () => {
    let luxonEnUtils = new LuxonUtils({ locale: "en-US" });

    it("is12HourCycleInCurrentLocale: properly determine should use meridiem or not", () => {
      expect(luxonEnUtils.is12HourCycleInCurrentLocale()).toBe(true);
    });
  });

  describe("in Russian", () => {
    let luxonUtils = new LuxonUtils({ locale: "ru" });
    const date = luxonUtils.date(TEST_TIMESTAMP);

    it("Should return weekdays starting with monday", () => {
      const result = luxonUtils.getWeekdays();
      expect(result).toEqual(["пн", "вт", "ср", "чт", "пт", "сб", "вс"]);
    });

    it("is12HourCycleInCurrentLocale: properly determine should use meridiem or not", () => {
      expect(luxonUtils.is12HourCycleInCurrentLocale()).toBe(false);
    });

    it("getCurrentLocaleCode: returns locale code", () => {
      expect(luxonUtils.getCurrentLocaleCode()).toBe("ru");
    });
  });
});

describe("Moment -- localization", () => {
  describe("Russian", () => {
    const momentUtils = new MomentUtils({ locale: "ru" });
    const date = momentUtils.date(TEST_TIMESTAMP);

    beforeEach(() => {
      moment.locale("ru");
    });

    it("getWeekdays: should start from monday", () => {
      const result = momentUtils.getWeekdays();
      expect(result).toEqual(["пн", "вт", "ср", "чт", "пт", "сб", "вс"]);
    });

    it("getWeekArray: week should start from monday", () => {
      const result = momentUtils.getWeekArray(date);
      expect(result[0][0].format("dd")).toBe("пн");
    });

    it("format: should use localized format token", () => {
      const result = momentUtils.format(date, "fullTime");
      expect(result).toBe("11:44");
    });

    it("is12HourCycleInCurrentLocale: properly determine should use meridiem or not", () => {
      expect(momentUtils.is12HourCycleInCurrentLocale()).toBe(false);
    });

    it("getCurrentLocaleCode: returns locale code", () => {
      expect(momentUtils.getCurrentLocaleCode()).toBe("ru");
    });

    it("getMeridiemText: returns translated AM/PM format on available locales.", () => {
      expect(momentUtils.getMeridiemText("am")).toBe("AM");
      expect(momentUtils.getMeridiemText("pm")).toBe("PM");
    });

    it("parse: should parse localized dates", () => {
      const format = "ddd-MMMM-DD-YYYY";
      const dateString = "вт-октябрь-30-2018";
      expect(
        momentUtils.formatByString(momentUtils.parse(dateString, format), format)
      ).toBe(dateString);
    });
  });

  describe("Korean", () => {
    const momentUtils = new MomentUtils({ locale: "ko" });

    beforeEach(() => {
      moment.locale("ko");
    });

    it("getMeridiemText: returns translated AM/PM format on available locales.", () => {
      expect(momentUtils.getMeridiemText("am")).toBe("오전");
      expect(momentUtils.getMeridiemText("pm")).toBe("오후");
    });
  });

  describe("English", () => {
    const momentUtils = new MomentUtils({ locale: "en" });
    const date = momentUtils.date(TEST_TIMESTAMP);

    beforeEach(() => {
      moment.locale("en");
    });

    it("getWeekdays: should start from monday", () => {
      const result = momentUtils.getWeekdays();
      expect(result).toEqual(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
    });

    it("getWeekArray: week should start from monday", () => {
      const result = momentUtils.getWeekArray(date);
      expect(result[0][0].format("dd")).toBe("Su");
    });

    it("is12HourCycleInCurrentLocale: properly determine should use meridiem or not", () => {
      expect(momentUtils.is12HourCycleInCurrentLocale()).toBe(true);
    });
  });
});

describe("Dayjs -- Localization", () => {
  dayjs.extend(advancedDayJsFormat);

  describe("Russian", () => {
    let dayjsUtils = new DayjsUtils({ instance: dayjs, locale: "ru" });
    const date = dayjsUtils.date(TEST_TIMESTAMP);

    it("getWeekdays: should start from monday", () => {
      const result = dayjsUtils.getWeekdays();
      expect(result).toEqual(["пн", "вт", "ср", "чт", "пт", "сб", "вс"]);
    });

    it("getWeekArray: week should start from monday", () => {
      const result = dayjsUtils.getWeekArray(date);
      expect(result[0][0].format("dd")).toBe("пн");
    });

    it("is12HourCycleInCurrentLocale: properly determine should use meridiem or not", () => {
      expect(dayjsUtils.is12HourCycleInCurrentLocale()).toBe(false);
    });

    it("getCurrentLocaleCode: returns locale code", () => {
      expect(dayjsUtils.getCurrentLocaleCode()).toBe("ru");
    });
  });

  describe("English", () => {
    let dayjsUtils = new DayjsUtils({ instance: dayjs, locale: "en" });
    const date = dayjsUtils.date(TEST_TIMESTAMP);

    it("getWeekdays: should start from sunday", () => {
      const result = dayjsUtils.getWeekdays();
      expect(result).toEqual(["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]);
    });

    it("getWeekArray: week should start from sunday", () => {
      const result = dayjsUtils.getWeekArray(date);
      expect(result[0][0].format("dd")).toBe("Su");
    });

    it("is12HourCycleInCurrentLocale: properly determine should use meridiem or not", () => {
      expect(dayjsUtils.is12HourCycleInCurrentLocale()).toBe(true);
    });
  });
});

describe("formatHelperText", () => {
  utilsTest("getFormatHelperText", (_, utils, lib) => {
    if (lib === "Luxon") {
      return;
    }

    expect(utils.getFormatHelperText(utils.formats.keyboardDate)).toBe("mm/dd/yyyy");
    expect(utils.getFormatHelperText(utils.formats.keyboardDateTime12h)).toBe(
      "mm/dd/yyyy hh:mm (a|p)m"
    );
  });

  it("Luxon -- getFormatHelperText should return empty string", () => {
    const utils = new LuxonUtils();

    expect(utils.getFormatHelperText(utils.formats.keyboardDate)).toBe("");
  });
});

describe("jsJoda -- Localization", () => {
  const russianFormats: DateIOFormats = {
    dayOfMonth: "d",
    fullDate: "d LLL yyyy 'г.'",
    fullDateWithWeekday: "EEEE, d LLLL yyyy 'г.'",
    fullDateTime: "d LLL yyyy 'г.', HH:mm",
    fullDateTime12h: "d LLL yyyy 'г.', hh:mm a",
    fullDateTime24h: "d LLL yyyy 'г.', HH:mm",
    fullTime: "",
    fullTime12h: "hh:mm a",
    fullTime24h: "HH:mm",
    hours12h: "hh",
    hours24h: "HH",
    keyboardDate: "dd.MM.yyyy",
    keyboardDateTime: "dd.MM.yyyy HH:mm",
    keyboardDateTime12h: "dd.MM.yyyy hh:mm a",
    keyboardDateTime24h: "dd.MM.yyyy HH:mm",
    minutes: "mm",
    month: "LLLL",
    monthAndDate: "LLLL d",
    monthAndYear: "LLLL yyyy",
    monthShort: "LLL",
    weekday: "EEEE",
    weekdayShort: "EEE",
    normalDate: "d MMMM",
    normalDateWithWeekday: "EEE, MMM d",
    seconds: "ss",
    shortDate: "MMM d",
    year: "yyyy",
  };
  const enJsJodaUtils = new JsJodaUtils({});
  const RuJsJodaUtils = new JsJodaUtils({ locale: new Locale("ru"),
    formats : russianFormats});

  it("Should return weekdays starting with monday", () => {
    const result = RuJsJodaUtils.getWeekdays();
    expect(result).toEqual(["пн", "вт", "ср", "чт", "пт", "сб", "вс"]);
  });

  it("is12HourCycleInCurrentLocale: properly determine should use meridiem or not", () => {
    expect(enJsJodaUtils.is12HourCycleInCurrentLocale()).toBe(true);
    expect(RuJsJodaUtils.is12HourCycleInCurrentLocale()).toBe(false);
    // default behavior
    expect(new DateFnsUtils().is12HourCycleInCurrentLocale()).toBe(true);
  });

  it("getCurrentLocaleCode: returns locale code", () => {
    expect(RuJsJodaUtils.getCurrentLocaleCode()).toBe("ru");
  });
  it("startOfWeek: returns correct start of week for locale", () => {
    expect(
      RuJsJodaUtils.formatByString(
        RuJsJodaUtils.startOfWeek(RuJsJodaUtils.date(TEST_TIMESTAMP)),
        "d"
      )
    ).toEqual("29");
  });
  it("endOfWeek: returns correct end of week for locale", () => {
    expect(
      RuJsJodaUtils.formatByString(
        RuJsJodaUtils.endOfWeek(RuJsJodaUtils.date(TEST_TIMESTAMP)),
        "d"
      )
    ).toEqual("4");
  });
});
