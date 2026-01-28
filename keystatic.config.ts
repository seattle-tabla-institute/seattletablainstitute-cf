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
        title: fields.text({ label: "Title" }),
        date: fields.date({ label: "Date" }),
        start_time: fields.text({
          label: "Start time",
          validation: { isRequired: false }
        }),
        end_time: fields.text({
          label: "End time",
          validation: { isRequired: false }
        }),
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
        image: fields.image({
          label: "Image",
          directory: "public/assets/uploads",
          publicPath: "/assets/uploads",
          validation: { isRequired: false }
        }),
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
              label: "Highlights"
            }),
            locations: fields.array(fields.text({ label: "Location" }), {
              label: "Locations"
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
              { label: "Pricing" }
            )
          }
        }),
        adult: fields.object({
          label: "Adult",
          fields: {
            highlights: fields.array(fields.text({ label: "Highlight" }), {
              label: "Highlights"
            }),
            locations: fields.array(fields.text({ label: "Location" }), {
              label: "Locations"
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
              { label: "Pricing" }
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
              image: fields.image({
                label: "Image",
                directory: "public/assets/uploads",
                publicPath: "/assets/uploads"
              }),
              alt: fields.text({ label: "Alt text" }),
              caption: fields.text({
                label: "Caption",
                validation: { isRequired: false }
              })
            }
          }),
          { label: "Photos" }
        ),
        videos: fields.array(
          fields.object({
            label: "Video",
            fields: {
              title: fields.text({ label: "Title" }),
              url: fields.text({ label: "YouTube URL" })
            }
          }),
          { label: "Videos" }
        )
      }
    })
  }
});
