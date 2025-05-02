// zip.service.ts
import { Injectable } from "@angular/core";
import JSZip from "jszip";
import { saveAs} from "file-saver"
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { featuresToCsvBlob } from "./featureToCSVBlob";

@Injectable({ providedIn: "root" })
export class ZipExportService {
  constructor() {}

  /** 
   * @param layers: array of tuples [layerName, FeatureLayer]
   * @param zipFilename: the name of the resulting zip file 
   */
  async exportLayersAsZip(
    layers: [string, FeatureLayer][],
    zipFilename: string = "filteredAdminLayers.zip"
  ) {
    const zip = new JSZip();

    // loop through each layer
    for (const [name, layer] of layers) {
      //const q = new Query({returnGeometry: false });
      const result = await layer.queryFeatures();
      // generate CSV blob
      const { blob, name: fileName } = featuresToCsvBlob(
        result.features,
        `${name}.csv`
      );
      // add to zip
      zip.file(fileName, blob);
    }

    // generate the zip file
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, zipFilename);
  }
}
