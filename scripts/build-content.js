const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const { marked } = require("marked");

const rootDir = path.join(__dirname, "..");
const eventsDir = path.join(rootDir, "content", "events");
const dataDir = path.join(rootDir, "public", "data");

const parseDate = (value) => {
  if (value instanceof Date) {
    return value;
  }
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T00:00:00Z`);
  }
  return new Date(value);
};

const toDateValue = (value) => {
  if (value instanceof Date) {
    return value.toISOString().split("T")[0];
  }
  return value || "";
};

const toDateLabel = (value) => {
  if (!value) {
    return "";
  }
  const date = parseDate(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone: "UTC"
  });
};

const getEventStatus = (dateValue) => {
  if (!dateValue) {
    return "upcoming";
  }
  const date = parseDate(dateValue);
  if (Number.isNaN(date.getTime())) {
    return "upcoming";
  }
  const today = new Date();
  const utcToday = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  return date < utcToday ? "past" : "upcoming";
};

const toTimeLabel = (startTime, endTime) => {
  if (startTime && endTime) {
    return `${startTime}–${endTime}`;
  }
  if (startTime) {
    return startTime;
  }
  if (endTime) {
    return `Ends ${endTime}`;
  }
  return "";
};

const titleFromSlug = (slug) =>
  slug
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (match) => match.toUpperCase());

const loadEvents = () => {
  if (!fs.existsSync(eventsDir)) {
    return [];
  }
  const files = fs.readdirSync(eventsDir).filter((file) => file.endsWith(".md"));
  return files.map((file) => {
    const fullPath = path.join(eventsDir, file);
    const raw = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(raw);
    const dateValue = toDateValue(data.date);
    const startTime = data.start_time || "";
    const endTime = data.end_time || "";
    const slug = path.basename(file, ".md");
    const fallbackTitle = titleFromSlug(slug);
    const status = getEventStatus(dateValue);
    return {
      slug,
      title: data.title || data.name || fallbackTitle || "Untitled Event",
      date: dateValue,
      dateLabel: toDateLabel(dateValue),
      startTime,
      endTime,
      timeLabel: toTimeLabel(startTime, endTime),
      status,
      category: data.category || "",
      location: data.location || "",
      featured: Boolean(data.featured),
      summary: data.summary || "",
      image: data.image || "",
      body: content.trim() ? marked.parse(content.trim()) : ""
    };
  });
};

const writeEvents = (events) => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const sortByDate = (a, b) => {
    const aTime = Date.parse(a.date) || 0;
    const bTime = Date.parse(b.date) || 0;
    return aTime - bTime;
  };

  const upcoming = events.filter((event) => event.status === "upcoming").sort(sortByDate);
  const past = events.filter((event) => event.status === "past").sort((a, b) => sortByDate(b, a));

  const output = { upcoming, past };
  const outputPath = path.join(dataDir, "events.json");
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
};

const events = loadEvents();
writeEvents(events);
