const loadJson = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    return response.json();
  } catch (error) {
    return null;
  }
};

const setList = (element, items) => {
  if (!element || !Array.isArray(items)) {
    return;
  }
  element.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    element.appendChild(li);
  });
};

const setPills = (element, items) => {
  if (!element || !Array.isArray(items)) {
    return;
  }
  element.innerHTML = "";
  items.forEach((item) => {
    const span = document.createElement("span");
    span.textContent = item;
    element.appendChild(span);
  });
};

const setPricingCards = (element, pricing) => {
  if (!element || !Array.isArray(pricing)) {
    return;
  }
  element.innerHTML = "";
  pricing.forEach((price) => {
    const card = document.createElement("div");
    card.className = "price-card";
    card.innerHTML = `
      <strong>${price.label || ""}</strong>
      <p>${price.price || ""}</p>
      ${price.notes ? `<p class="note">${price.notes}</p>` : ""}
    `;
    element.appendChild(card);
  });
};

const renderClasses = async () => {
  const youthHighlights = document.querySelector("#youth-highlights");
  const youthLocations = document.querySelector("#youth-locations");
  const youthSchedule = document.querySelector("#youth-schedule");
  const youthPricing = document.querySelector("#youth-pricing");
  const adultHighlights = document.querySelector("#adult-highlights");
  const adultLocations = document.querySelector("#adult-locations");
  const adultSchedule = document.querySelector("#adult-schedule");
  const adultPricing = document.querySelector("#adult-pricing");

  if (
    !youthHighlights &&
    !youthLocations &&
    !youthSchedule &&
    !youthPricing &&
    !adultHighlights &&
    !adultLocations &&
    !adultSchedule &&
    !adultPricing
  ) {
    return;
  }

  const data = await loadJson("data/classes.json");
  if (!data) {
    return;
  }

  if (data.youth) {
    setList(youthHighlights, data.youth.highlights || []);
    setPills(youthLocations, data.youth.locations || []);
    if (youthSchedule) {
      youthSchedule.textContent = data.youth.schedule_note || "";
    }
    setPricingCards(youthPricing, data.youth.pricing || []);
  }

  if (data.adult) {
    setList(adultHighlights, data.adult.highlights || []);
    setPills(adultLocations, data.adult.locations || []);
    if (adultSchedule) {
      adultSchedule.textContent = data.adult.schedule_note || "";
    }
    setPricingCards(adultPricing, data.adult.pricing || []);
  }
};

const createEventCard = (event) => {
  const card = document.createElement("article");
  const hasImage = Boolean(event.image);
  card.className = `card event-card${hasImage ? " has-image" : ""}`;
  const category = event.category ? `<p class="pill">${event.category}</p>` : "";
  const metaParts = [event.dateLabel, event.timeLabel, event.location || "Location TBA"].filter(Boolean);
  const meta = metaParts.length ? `<p class="event-meta">${metaParts.join(" · ")}</p>` : "";
  const summaryText =
    event.summary ||
    "Join us for an intimate community gathering featuring live tabla and Hindustani music.";
  const summary = `<p>${summaryText}</p>`;
  const image = event.image
    ? `<img src="${encodeURI(event.image)}" alt="${event.title || "Event image"}" loading="lazy" decoding="async" />`
    : "";
  const details = event.body
    ? `<details class="event-body"><summary>View event details</summary>${event.body}</details>`
    : `<a class="button ghost" href="contact.html">View event details</a>`;
  card.innerHTML = `
    ${image}
    <div class="event-content">
      ${category}
      <h3>${event.title || "Event"}</h3>
      ${meta}
      ${summary}
      ${details}
    </div>
  `;
  return card;
};

const renderEvents = async () => {
  const upcomingContainer = document.querySelector("#events-upcoming");
  const pastContainer = document.querySelector("#events-past");
  const emptyMessage = document.querySelector("#events-empty");

  if (!upcomingContainer && !pastContainer && !emptyMessage) {
    return;
  }

  const data = await loadJson("data/events.json");
  if (!data) {
    return;
  }

  if (upcomingContainer) {
    upcomingContainer.innerHTML = "";
    (data.upcoming || []).forEach((event) => {
      upcomingContainer.appendChild(createEventCard(event));
    });
  }

  if (pastContainer) {
    pastContainer.innerHTML = "";
    (data.past || []).forEach((event) => {
      pastContainer.appendChild(createEventCard(event));
    });
  }

  if (emptyMessage) {
    const hasEvents = (data.upcoming || []).length > 0;
    emptyMessage.style.display = hasEvents ? "none" : "block";
  }
};

const renderHomeEvent = async () => {
  const homeCard = document.querySelector("#home-upcoming");
  if (!homeCard) {
    return;
  }

  const data = await loadJson("data/events.json");
  const event = data && (data.upcoming || [])[0];
  if (!event) {
    return;
  }

  const metaParts = [event.dateLabel, event.timeLabel, event.location || "Location TBA"].filter(Boolean);
  const meta = metaParts.length ? `<p class="event-meta">${metaParts.join(" · ")}</p>` : "";
  const summaryText =
    event.summary ||
    "Join us for an intimate community gathering featuring live tabla and Hindustani music.";
  const image = event.image
    ? `<img class="event-thumb" src="${encodeURI(event.image)}" alt="${event.title || "Event image"}" loading="lazy" decoding="async" />`
    : "";

  homeCard.innerHTML = `
    <p class="pill">Upcoming event</p>
    ${image}
    <h2>${event.title || "Upcoming event"}</h2>
    ${meta}
    <p>${summaryText}</p>
    <a class="button ghost" href="events.html">View event details</a>
  `;
};

const toYouTubeEmbed = (url) => {
  if (!url) {
    return "";
  }
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/
  );
  if (!match) {
    return "";
  }
  return `https://www.youtube.com/embed/${match[1]}`;
};

const renderGallery = async () => {
  const photoGrid = document.querySelector("#gallery-photos");
  const videoGrid = document.querySelector("#gallery-videos");

  if (!photoGrid && !videoGrid) {
    return;
  }

  const data = await loadJson("data/gallery.json");
  if (!data) {
    return;
  }

  if (photoGrid) {
    photoGrid.innerHTML = "";
    (data.photos || []).forEach((photo) => {
      const card = document.createElement("div");
      card.className = "media-card";
      card.innerHTML = `
        <img src="${encodeURI(photo.image)}" alt="${photo.alt || "STI gallery"}" loading="lazy" decoding="async" />
        ${photo.caption ? `<p class="media-caption">${photo.caption}</p>` : ""}
      `;
      photoGrid.appendChild(card);
    });
  }

  if (videoGrid) {
    videoGrid.innerHTML = "";
    (data.videos || []).forEach((video) => {
      const embed = toYouTubeEmbed(video.url);
      if (!embed) {
        return;
      }
      const card = document.createElement("div");
      card.className = "media-card";
      card.innerHTML = `
        <div class="video-frame">
          <iframe
            src="${embed}"
            title="${video.title || "STI video"}"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
        ${video.title ? `<p class="media-caption">${video.title}</p>` : ""}
      `;
      videoGrid.appendChild(card);
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  renderClasses();
  renderEvents();
  renderHomeEvent();
  renderGallery();
});
