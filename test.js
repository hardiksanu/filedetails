
const currentDate = new Date();
const todayDateinGB = new Date().toLocaleDateString(undefined, {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
});
const todayDateinUS = new Date().toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
});
const timestamp = currentDate.getTime();

const date = currentDate.getDate();
const Month = currentDate.getMonth();
const Year = currentDate.getFullYear();

const date1 = new Date("Wed, 27 July 2016 13:30:00");
const date2 = new Date("Wed, 27 July 2016 07:45:00 UTC");
const date3 = new Date("27 July 2016 13:30:00 UTC+05:45");
// const datewithTime = new Date().now.toLocaleString();


const datestring = date + "" + (Month + 1) + "" + Year;
// const datestring = date + "-" + (Month + 1) + "-" + Year;
console.log(datestring, timestamp);
console.log(date1);
console.log(date2);
console.log(date3);
console.log(todayDateinGB);
console.log(todayDateinUS);
// console.log(datewithTime);
//Formatting a date

//Suppose american date
const Fisrtdate = new Date(2023, 1, 25); // 1 for February
const enUSFormetter = new Intl.DateTimeFormat('en-US');
// Longer date in american format
const longenUSFormetter = new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
});
console.log("date as US format");
console.log(enUSFormetter.format(Fisrtdate));
console.log(longenUSFormetter.format(Fisrtdate));

//Now we wants day of month is in ordinal format.

const pluralRule = new Intl.PluralRules('en-US', {
          type: 'ordinal'
});

const suffixes = {
          'one': 'st',
          'two': 'nd',
          'few': 'rd',
          'other': 'th'
}

const converToOrdinal = (number) => `${number}${suffixes[pluralRule.select(number)]}`
// At this point:
// convertToOrdinal("1") === "1st"
// convertToOrdinal("2") === "2nd"
// etc.
const extractvalueAndCustomizeDayofMonth = (part) => {
          if (part.type === "day") {
                    return converToOrdinal(part.value);
          }
          return part.value;
}

console.log(
          longenUSFormetter.formatToParts(Fisrtdate)
                    .map(extractvalueAndCustomizeDayofMonth)
                    .join("")
);
//Suppose europe date

const nlBEFormetter = new Intl.DateTimeFormat('nl-BE');
console.log("date as Europe format");
console.log(nlBEFormetter.format(Fisrtdate));

// 

// We can get the date in MM/DD/YYYY format as
const dateMonthYear = (Month + 1) + "/" + date + "/" + Year;
// The problem with this solution is that it can give an inconsistent length to the dates because some months and days of the month are single-digit and others double-digit. This can be problematic, for example, if you are displaying the date in a table column, because the dates don’t line up.

function pad(n) {
          return n < 10 ? '0' + n : n;
}
//in mm/dd/yyyy format
const mmddyyyy = pad(Month + 1) + "/" + pad(date) + "/" + Year;
// in dd/mm/yyyy format
const ddmmyyyy = pad(date) + pad(Month + 1)  + Year;
console.log(dateMonthYear, "IN mmddyyyy format", mmddyyyy, "In ddmmyyyy format", ddmmyyyy);

// try to print the date in “Month Date, Year” format. We will need a mapping of month indexes to names:
const monthNames = [
          "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
];
const dateWithFullMonthName = monthNames[Month] + " " + pad(date) + ", " + Year;
console.log(dateWithFullMonthName);

// If suppose print the date as 4th Febraury, 2023. We can print

const ordinalDate = converToOrdinal(date) + " " + monthNames[Month] + ", " + Year;
console.log(ordinalDate);

// It is easy to determine the day of week from the date object, so let’s add that in:

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
ordinalDateWithDayofWeek = daysOfWeek[currentDate.getDay()] + ", " + ordinalDate;
console.log(ordinalDateWithDayofWeek);

