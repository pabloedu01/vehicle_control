import moment from "moment-timezone";

export function formatDateTimezone (date) {
  return moment.utc(date).tz("America/Sao_Paulo").format()
}

export function formatDateTimePresentation (date) {
  return moment(date).format('DD/MM/YYYY')
}