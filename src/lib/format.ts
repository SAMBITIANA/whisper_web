export function formatDuration(totalSeconds: number): string {
  if (totalSeconds <= 0) return "0:00";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function localizeNumber(value: number): string {
  return value.toFixed(1).replace(/\.0$/, "").replace(".", ",");
}

export function formatViews(views: number): string {
  if (views >= 1_000_000) {
    return `${localizeNumber(views / 1_000_000)} M`;
  }
  if (views >= 1_000) {
    return `${localizeNumber(views / 1_000)} k`;
  }
  return new Intl.NumberFormat("fr-FR").format(views);
}

export function typography(text: string): string {
  return text
    .replace(/'/g, "\u2019")
    .replace(/\.\.\./g, "\u2026")
    .replace(/ ([?!:;»])/g, "\u202F$1")
    .replace(/«(?=\S)/g, "«\u00A0");
}

export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
