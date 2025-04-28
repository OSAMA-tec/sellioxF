export const categories = {
    "domestic": [
      {
        header: "animals & pets",
        links: ["Pet sitting", "Dog walker", "Pet grooming", "Veterinary services", "Pet training", "Pet adoption"]
      },
      {
        header: "architecture & design",
        links: ["Interior design", "Home renovation", "Landscape design", "Architecture consultation"]
      },
      {
        header: "babysitting",
        links: ["Daycare", "Night babysitting", "Nanny services", "Special needs childcare"]
      },
      {
        header: "cleaning",
        links: ["Residential", "Commercial", "Deep cleaning", "Window cleaning"]
      },
      {
        header: "moving & storage",
        links: ["Local moving", "Long-distance moving", "Packing & unpacking", "Storage solutions"]
      },
      {
        header: "outdoor & garden",
        links: ["Lawn maintenance", "Tree services", "Irrigation & sprinkler systems", "Landscaping", "Garden installations"]
      },
      {
        header: "pool & pool cleaning",
        links: ["Pool maintenance", "Pool installation"]
      },
      {
        header: "other",
        links: ["Home security", "Appliance repairs", "Home organization", "Pest control", "Painting"]
      }
    ],
    "event & entertainment": [
      {
        header: "caterers",
        links: ["Wedding catering", "Corporate events catering", "Private parties", "Food catering", "Bartending"]
      },
      {
        header: "entertainers",
        links: ["Magicians", "Clowns & jugglers", "Stand-up comedians", "Live bands & musicians", "DJs"]
      },
      {
        header: "photography & videography",
        links: ["Wedding", "Portrait", "Event", "Drone photography", "Commercial", "Real estate"]
      },
      {
        header: "event planner",
        links: ["Corporate events", "Birthdays", "Fundraisers", "Conferences & seminars", "Trade shows & expos", "Event decoration"]
      },
      {
        header: "party rentals & supplies",
        links: ["Tables & chairs", "Tents & canopies", "Linens & tableware", "Inflatables & games", "Lighting & sound equipment", "Themed decorations & props"]
      },
      {
        header: "event decoration",
        links: ["Floral", "Lighting & production", "Themed decorations", "Balloon artistry", "Event draping", "Ice sculptures"]
      },
      {
        header: "wedding",
        links: ["Wedding planning", "Bridal makeup & hairstyling", "Florists", "DJs & bands", "Honeymoon planning"]
      },
      {
        header: "other",
        links: ["Security", "Transportation", "Staffing", "Marketing", "Ticketing"]
      }
    ],
    "trade": [
      {
        header: "alarm & security",
        links: ["Home security", "Alarm monitoring", "Security cameras", "Smart home systems"]
      },
      {
        header: "building & construction",
        links: ["General contractor", "Residential", "Commercial", "Renovation & remodeling", "Custom homes", "Demolition"]
      },
      {
        header: "electrical & gas",
        links: ["Electricians", "Gas fitting", "Appliance repairs"]
      },
      {
        header: "hvac",
        links: ["HVAC installation", "HVAC maintenance", "Air conditioning repair"]
      },
      {
        header: "pest control",
        links: ["Residential pest control", "Commercial pest control"]
      },
      {
        header: "landscape & outdoor",
        links: ["Landscaping", "Concrete work", "Fencing & gates", "Carpentry"]
      },
      {
        header: "other",
        links: ["Painting & plastering", "Roofing"]
      }
    ],
    "other": [
      {
        header: "experiences & tourism",
        links: ["Tour guides", "Adventure tours", "Cultural & heritage tours", "Food tours"]
      },
      {
        header: "tuition & learning",
        links: ["School tutoring", "Music lessons", "Language lessons", "Art lessons"]
      },
      {
        header: "computer repairs",
        links: ["Hardware repairs", "Software troubleshooting", "Data recovery"]
      },
      {
        header: "handyman",
        links: ["Minor home repairs", "Furniture assembly", "General maintenance"]
      },
      {
        header: "signage & graphics",
        links: ["Custom signage", "Graphic design services"]
      },
      {
        header: "other",
        links: ["Miscellaneous services"]
      }
    ]
  };
  
  // Flattened array of all categories
  export const allCategories = [
    ...categories["domestic"],
    ...categories["event & entertainment"],
    ...categories["trade"],
    ...categories["other"]
  ];
  
  // Array of main category headers
  export const mainCategories = Object.keys(categories).flatMap((key) => 
    categories[key].map((item) => item.header)
  );
  
  // Function to get links for a specific header
  export const getLinksByHeader = (selectedHeader) => {
    for (const key in categories) {
      for (const item of categories[key]) {
        if (item.header.toLowerCase() === selectedHeader.toLowerCase()) {
          return item.links; // Return the links of the matched header
        }
      }
    }
    return []; // Return empty array if header not found
  };
  