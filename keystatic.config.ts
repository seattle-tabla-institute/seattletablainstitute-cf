import { config, fields, collection, singleton } from "@keystatic/core";

export default config({
  storage: {
    kind: "github",
    repo: "seattle-tabla-institute/seattletablainstitute-cf"
  },
  collections: {
    events: collection({
      label: "Events",
      path: "content/events/*",
      format: { contentField: "body" },
      slugField: "title",
      entryLayout: "content",
      schema: {
        title: fields.text({ label: "Title", validation: { isRequired: true } }),
        date: fields.date({ label: "Date" }),
        status: fields.select({
          label: "Status",
          options: [
            { label: "Upcoming", value: "upcoming" },
            { label: "Past", value: "past" }
          ],
          defaultValue: "upcoming"
        }),
        category: fields.text({ label: "Category", validation: { isRequired: false } }),
        location: fields.text({ label: "Location", validation: { isRequired: false } }),
        featured: fields.checkbox({ label: "Featured", defaultValue: false }),
        summary: fields.text({ label: "Summary", multiline: true, validation: { isRequired: false } }),
        image: fields.text({ label: "Image", validation: { isRequired: false } }),
        body: fields.markdoc({ label: "Details", extension: "md" })
      }
    })
  },
  singletons: {
    classes: singleton({
      label: "Classes",
      path: "public/data/classes",
      format: { data: "json" },
      schema: {
        youth: fields.object({
          label: "Youth",
          fields: {
            highlights: fields.array(fields.text({ label: "Highlight" }), {
              label: "Highlights",
              itemLabel: (item) => item.value || "Highlight"
            }),
            locations: fields.array(fields.text({ label: "Location" }), {
              label: "Locations",
              itemLabel: (item) => item.value || "Location"
            }),
            schedule_note: fields.text({
              label: "Schedule Note",
              multiline: true,
              validation: { isRequired: false }
            }),
            pricing: fields.array(
              fields.object({
                label: "Pricing Item",
                fields: {
                  label: fields.text({ label: "Label" }),
                  price: fields.text({ label: "Price" }),
                  notes: fields.text({
                    label: "Notes",
                    validation: { isRequired: false }
                  })
                }
              }),
              {
                label: "Pricing",
                itemLabel: (item) => item.fields.label.value || "Pricing Item"
              }
            )
          }
        }),
        adult: fields.object({
          label: "Adult",
          fields: {
            highlights: fields.array(fields.text({ label: "Highlight" }), {
              label: "Highlights",
              itemLabel: (item) => item.value || "Highlight"
            }),
            locations: fields.array(fields.text({ label: "Location" }), {
              label: "Locations",
              itemLabel: (item) => item.value || "Location"
            }),
            schedule_note: fields.text({
              label: "Schedule Note",
              multiline: true,
              validation: { isRequired: false }
            }),
            pricing: fields.array(
              fields.object({
                label: "Pricing Item",
                fields: {
                  label: fields.text({ label: "Label" }),
                  price: fields.text({ label: "Price" }),
                  notes: fields.text({
                    label: "Notes",
                    validation: { isRequired: false }
                  })
                }
              }),
              {
                label: "Pricing",
                itemLabel: (item) => item.fields.label.value || "Pricing Item"
              }
            )
          }
        })
      }
    }),
    gallery: singleton({
      label: "Gallery",
      path: "public/data/gallery",
      format: { data: "json" },
      schema: {
        photos: fields.array(
          fields.object({
            label: "Photo",
            fields: {
              image: fields.text({ label: "Image" }),
              alt: fields.text({ label: "Alt text" }),
              caption: fields.text({
                label: "Caption",
                validation: { isRequired: false }
              })
            }
          }),
          {
            label: "Photos",
            itemLabel: (item) => item.fields.alt.value || "Photo"
          }
        ),
        videos: fields.array(
          fields.object({
            label: "Video",
            fields: {
              title: fields.text({ label: "Title" }),
              url: fields.text({ label: "YouTube URL" })
            }
          }),
          {
            label: "Videos",
            itemLabel: (item) => item.fields.title.value || "Video"
          }
        )
      }
    })
  }
});
