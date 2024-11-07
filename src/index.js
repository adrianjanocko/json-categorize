import { defineHook } from "@directus/extensions-sdk";

const ROUTE_MATCH = /\/items\/([^-]+)\/([^-?]+)/;

export default defineHook(
  ({ init }, { services, database: knex, getSchema }) => {
    const { ItemsService } = services;

    function getParams(url) {
      const result = url.match(ROUTE_MATCH);
      return { collection: result[1], id: result[2] };
    }

    async function organizeSectionsMiddleware(req, res, next) {
      if (req.method !== "GET") return next();
      if (!ROUTE_MATCH.test(req.url)) return next();

      const { collection, id } = getParams(req.url);
      const service = new ItemsService(collection, {
        knex,
        schema: await getSchema(),
        accountability: req.accountability,
      });

      try {
        let itemsData;
        if (id === "all") {
          itemsData = await service.readByQuery({});
        } else {
          itemsData = [await service.readOne(id)];
        }

        function categorizeItem(itemData) {
          const organizedData = {};
          for (const [field, value] of Object.entries(itemData)) {
            if (field === "languages_code" || field.endsWith("_id")) {
              organizedData[field] = value;
            } else {
              const underscoreIndex = field.indexOf("_");
              if (underscoreIndex !== -1) {
                const section = field.substring(0, underscoreIndex);
                const fieldName = field.substring(underscoreIndex + 1);

                if (!organizedData[section]) {
                  organizedData[section] = {};
                } else if (typeof organizedData[section] !== "object") {
                  organizedData[section] = { value: organizedData[section] };
                }
                organizedData[section][fieldName] = value;
              } else {
                organizedData[field] = value;
              }
            }
          }
          return organizedData;
        }

        const categorizedItems = itemsData.map(categorizeItem);

        res.json(id === "all" ? categorizedItems : categorizedItems[0]);
      } catch (error) {
        console.error("Error organizing sections:", error);
        next(error);
      }
    }

    init("middlewares.after", ({ app }) => app.use(organizeSectionsMiddleware));
  }
);
