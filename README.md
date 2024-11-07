[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/adrianjanocko/json-categorize)

## Overview

The Categorize JSON Extension provides a convenient way to organize JSON data by grouping fields based on their prefixes. This is particularly useful for applications that need to structure data sections dynamically, making the JSON response more readable and easier to work with.

For example, fields such as `navbar_blog`, `navbar_forum`, and `footer_privacy_policy` are automatically grouped under sections like `navbar` and `footer`, resulting in a more structured JSON output.

### Special cases

- **Ignored fields:** Field `languages_code` and fields that ends with `_id` are not categorized.
- **No subfield fields:** For fields without a specific subfield (e.g., `source` and `source_type`), the category is determined by the prefix, and any standalone field (like `source`) without an underscore is categorized under a `value`.

![Example of JSON categorization](https://i.imgur.com/WzjJbcy.png)

## Usage

After installation, this middleware will automatically organize JSON data for specified item routes in Directus.

To retrieve and categorize a specific item by its ID, use the following route:

```ruby
GET /items/:collection/:id
```

If you use `all` in place of the `:id` parameter, the middleware will retrieve and categorize **all items** in the specified collection, returning a list of categorized objects:

```ruby
GET /items/:collection/all
```
