// Alternative Resources Manager
class AlternativeResourcesManager {
  constructor() {
    this.resources = [];
    this.categories = {};
    this.loadResources();
  }

  async loadResources() {
    try {
      const response = await fetch("web/api/alternative-resources.json");
      const data = await response.json();

      this.resources = data.alternative_resources.resources;
      this.categories = data.alternative_resources.categories;

      this.renderResources();
    } catch (error) {
      console.error("Error loading alternative resources:", error);
      this.renderFallbackResources();
    }
  }

  renderResources() {
    const container = document.getElementById(
      "alternative-resources-container"
    );
    if (!container) return;

    let html = "";

    // Group resources by category
    const groupedResources = this.groupResourcesByCategory();

    Object.keys(groupedResources).forEach((categoryKey) => {
      const category = this.categories[categoryKey];
      const resources = groupedResources[categoryKey];

      if (!category || !resources.length) return;

      html += `
                <div class="col-12 mb-4">
                    <h4 style="color: ${category.color}; margin-bottom: 20px;">
                        <i class="fas fa-${this.getCategoryIcon(
                          categoryKey
                        )}"></i>
                        ${category.name}
                    </h4>
                    <p style="color: #666; margin-bottom: 20px;">${
                      category.description
                    }</p>
                </div>
            `;

      resources.forEach((resource) => {
        html += this.renderResourceCard(resource);
      });
    });

    container.innerHTML = html;
  }

  groupResourcesByCategory() {
    const grouped = {};

    this.resources.forEach((resource) => {
      let categoryKey = "alternative"; // default

      if (resource.type.includes("רשמי") || resource.type.includes("ממשלתי")) {
        categoryKey = "official";
      } else if (
        resource.type.includes("מקומי") ||
        resource.type.includes("עירוני")
      ) {
        categoryKey = "municipal";
      } else if (
        resource.type.includes("אפליקציה") ||
        resource.type.includes("נייד")
      ) {
        categoryKey = "mobile";
      } else if (
        resource.type.includes("דיגיטלית") ||
        resource.type.includes("חברתיות")
      ) {
        categoryKey = "digital";
      } else if (
        resource.type.includes("טלפוני") ||
        resource.type.includes("קו")
      ) {
        categoryKey = "telephone";
      }

      if (!grouped[categoryKey]) {
        grouped[categoryKey] = [];
      }
      grouped[categoryKey].push(resource);
    });

    return grouped;
  }

  renderResourceCard(resource) {
    const statusBadge = this.getStatusBadge(resource.status);
    const featuresHtml = resource.features
      ? resource.features.map((feature) => `<li>${feature}</li>`).join("")
      : "";

    return `
            <div class="col-lg-6 mb-4">
                <div class="subproject-card" style="border-left: 5px solid ${
                  resource.color
                };">
                    <div class="subproject-icon" style="color: ${
                      resource.color
                    };">
                        ${resource.icon}
                    </div>
                    <h4 class="subproject-title">${resource.name}</h4>
                    <div class="subproject-code">
                        ${resource.type}
                        ${statusBadge}
                    </div>
                    <p class="subproject-description">${
                      resource.description
                    }</p>
                    ${
                      featuresHtml
                        ? `
                        <div style="margin: 15px 0;">
                            <strong>תכונות:</strong>
                            <ul style="margin: 5px 0; padding-right: 20px; font-size: 0.9rem;">
                                ${featuresHtml}
                            </ul>
                        </div>
                    `
                        : ""
                    }
                    <a href="${resource.url}" 
                       target="_blank" 
                       class="subproject-link"
                       ${
                         resource.status === "planned"
                           ? 'style="opacity: 0.6; pointer-events: none;"'
                           : ""
                       }>
                        <i class="fas fa-external-link-alt"></i> 
                        ${
                          resource.status === "planned"
                            ? "בפיתוח"
                            : "כניסה למאגר"
                        } →
                    </a>
                </div>
            </div>
        `;
  }

  getStatusBadge(status) {
    const badges = {
      active: '<span class="badge bg-success ms-2">פעיל</span>',
      planned: '<span class="badge bg-warning ms-2">מתוכנן</span>',
      inactive: '<span class="badge bg-secondary ms-2">לא פעיל</span>',
    };
    return badges[status] || "";
  }

  getCategoryIcon(categoryKey) {
    const icons = {
      official: "landmark",
      municipal: "city",
      mobile: "mobile-alt",
      digital: "share-alt",
      telephone: "phone",
      alternative: "exchange-alt",
    };
    return icons[categoryKey] || "link";
  }

  renderFallbackResources() {
    const container = document.getElementById(
      "alternative-resources-container"
    );
    if (!container) return;

    container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i>
                    <strong>הערה:</strong> לא ניתן לטעון את רשימת המאגרים האלטרנטיביים. 
                    אנא רענן את הדף או בדוק את החיבור לאינטרנט.
                </div>
            </div>
        `;
  }

  // Method to add new resource dynamically
  addResource(resource) {
    this.resources.push(resource);
    this.renderResources();
  }

  // Method to filter resources by status
  filterByStatus(status) {
    return this.resources.filter((resource) => resource.status === status);
  }

  // Method to search resources
  searchResources(query) {
    const lowerQuery = query.toLowerCase();
    return this.resources.filter(
      (resource) =>
        resource.name.toLowerCase().includes(lowerQuery) ||
        resource.description.toLowerCase().includes(lowerQuery) ||
        resource.type.toLowerCase().includes(lowerQuery)
    );
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize the alternative resources manager
  window.alternativeResourcesManager = new AlternativeResourcesManager();

  // Add search functionality
  const searchInput = document.getElementById("resource-search");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const query = this.value;
      if (query.length > 2) {
        const results =
          window.alternativeResourcesManager.searchResources(query);
        console.log("Search results:", results);
        // You can implement search results display here
      }
    });
  }

  // Add filter buttons
  const filterButtons = document.querySelectorAll(".resource-filter");
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const status = this.dataset.status;
      const filtered =
        window.alternativeResourcesManager.filterByStatus(status);
      console.log(`Filtered by ${status}:`, filtered);
      // You can implement filtered display here
    });
  });
});

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = AlternativeResourcesManager;
}
