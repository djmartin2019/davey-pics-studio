# Contentful Content Model for Davey Pics Studio

## Page Banner Content Type

**Content Type ID:** `pageBanner`

**Description:** Used to manage hero banner images for different pages of the website. This allows for manual updates to page banners without changing the page code.

**Fields:**

| Field Name | Field ID | Type | Description |
|------------|----------|------|-------------|
| Title | title | Short text | Admin title for the banner (for CMS organization) |
| Page Identifier | pageIdentifier | Short text | Identifier for the page this banner belongs to (e.g., "parks", "services", "parks-detail", "services-detail", "parks-detail-{slug}") |
| Banner Image | bannerImage | Media - Image | The hero image to display on the page |
| Heading Text | headingText | Short text | Optional override for the page heading |
| Subheading Text | subheadingText | Short text | Optional override for the page subheading |
| Is Active | isActive | Boolean | Whether this banner should be used (allows for easy enabling/disabling) |
| Description | description | Long text | Admin notes about this banner (for CMS organization) |

## Page Identifier Values

Use these values for the `pageIdentifier` field:

- `parks` - Main parks listing page
- `services` - Main services listing page
- `parks-detail` - Generic template for all park detail pages
- `services-detail` - Generic template for all service detail pages
- `parks-detail-{slug}` - Specific park detail page (replace {slug} with the park's slug)
- `services-detail-{slug}` - Specific service detail page (replace {slug} with the service's slug)

## Usage Examples

1. **Main Parks Page Banner:**
   - Title: "Parks Listing Banner"
   - Page Identifier: "parks"
   - Banner Image: [Upload image]
   - Heading Text: "Photography Locations"
   - Subheading Text: "Discover the best parks and wildlife areas for photography in Houston and beyond"
   - Is Active: true

2. **Specific Park Detail Page Banner:**
   - Title: "Brazos Bend State Park Banner"
   - Page Identifier: "parks-detail-brazos-bend"
   - Banner Image: [Upload image]
   - Heading Text: "Brazos Bend State Park"
   - Subheading Text: "A premier location for wildlife photography in Texas"
   - Is Active: true

3. **Generic Service Detail Banner:**
   - Title: "Service Detail Pages Banner"
   - Page Identifier: "services-detail"
   - Banner Image: [Upload image]
   - Heading Text: [leave empty to use default]
   - Subheading Text: [leave empty to use default]
   - Is Active: true
