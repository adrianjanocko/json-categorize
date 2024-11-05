## Overview

The Categorize JSON Extension provides a convenient way to organize JSON data by grouping fields based on their prefixes. This is particularly useful for applications that need to structure data sections dynamically, making the JSON response more readable and easier to work with.

For example, fields such as `navbar_blog`, `navbar_forum`, and `footer_privacy_policy` are automatically grouped under sections like `navbar` and `footer`, resulting in a more structured JSON output.

![Example of JSON categorization](https://i.imgur.com/IRD2afO.png)

## Usage

After installation, this middleware will automatically organize JSON data for specified item routes in Directus.

```
GET /items/:collection/:id
```
