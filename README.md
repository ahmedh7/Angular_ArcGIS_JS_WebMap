# Angular-ArcGIS Maps SDK for JavaScript

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.8.


This project is a GIS web-based mapping application built with the **Angular Framework** and the **ArcGIS JavaScript API**, designed to visualize and interact with administrative boundary data.

---

## 🖼️ Screenshots

### 📍 Map Usage
- ![MapUsage](src\assets\images\screenshots\screen.png)

### 📍 Print PDF
- ![PrintedPDF](src\assets\images\screenshots\pdf.png)

### 📍CSV Export
- ![CSV export](src\assets\images\screenshots\csv.png)

---

## 🗺️ Features

1. **Interactive Web Map Page**
   - Built using Angular and ArcGIS JavaScript API.
   - Displays data from the `Administrative_Boundaries_Reference_(view_layer)` Feature Service.

2. **Print to PDF**
   - Generates a PDF containing the current map extent and relevant statistics.
   - Users can download the PDF by clicking a print button in the UI.

3. **Export Filtered Data to CSV**
   - Allows users to filter administrative layers and export the result to a downloadable CSV file.

4. **Responsive UI**
   - All form-based controls and interactions are styled with a clean, functional design.
   - Designed for clarity and ease of use.

## 🛰️ Data Source

- [Administrative_Boundaries_Reference_(view_layer)](https://www.arcgis.com) – FeatureServer hosted by ArcGIS Online.

## 📦 Technologies Used

- [Angular](https://angular.io/)
- [ArcGIS API for JavaScript](https://developers.arcgis.com/javascript/)
- [TypeScript](https://www.typescriptlang.org/)
- [Angular Material](https://material.angular.io/) (UI components)
- HTML5, SCSS

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.


## Running end-to-end tests


## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

