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
        const itemData = await service.readOne(id);

        const organizedData = {};
        for (const [field, value] of Object.entries(itemData)) {
          if (field.startsWith("global_") || field.startsWith("languages_")) {
            organizedData[field] = value;
          } else {
            const underscoreIndex = field.indexOf("_");
            if (underscoreIndex !== -1) {
              const section = field.substring(0, underscoreIndex);
              const fieldName = field.substring(underscoreIndex + 1);

              if (!organizedData[section]) organizedData[section] = {};
              organizedData[section][fieldName] = value;
            } else {
              organizedData[field] = value;
            }
          }
        }

        res.json(organizedData);
      } catch (error) {
        console.error("Error organizing sections:", error);
        next(error);
      }
    }

    init("middlewares.after", ({ app }) => app.use(organizeSectionsMiddleware));
  }
);
