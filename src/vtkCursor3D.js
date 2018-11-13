
import macro from 'vtk.js/Sources/macro';
import vtkPolyData from 'vtk.js/Sources/Common/DataModel/PolyData';
import vtkCellArray from 'vtk.js/Sources/Common/Core/CellArray'
import vtkPoints from 'vtk.js/Sources/Common/Core/Points'

const { vtkWarningMacro } = macro;

// ----------------------------------------------------------------------------
// vtkCursor3D methods
// ----------------------------------------------------------------------------

function vtkCursor3D(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkCursor3D');
  publicAPI.requestData = (inData, outData) => {
    if (model.deleted) {
      return;
    }

    // // const dataset = outData[0];
    // let point1;
    // let point2;
    // point1 = [model.modelBounds[0], model.focalPoint[1], model.focalPoint[2]];
    // point2 = [model.modelBounds[1], model.focalPoint[1], model.focalPoint[2]];
    // const LineSource1 = vtkLineSource.newInstance({ point1, point2, resolution:1 });
    // point1 = [model.focalPoint[0], model.modelBounds[2], model.focalPoint[2]];
    // point2 = [model.focalPoint[0], model.modelBounds[3], model.focalPoint[2]];
    // const LineSource2 = vtkLineSource.newInstance({ point1, point2, resolution:1 });
    // point1 = [model.focalPoint[0], model.focalPoint[1], model.modelBounds[4]];
    // point2 = [model.focalPoint[0], model.focalPoint[1], model.modelBounds[5]];
    // const LineSource3 = vtkLineSource.newInstance({ point1, point2, resolution:1 });
    // const appendPolyData = vtkAppendPolyData.newInstance();
    // appendPolyData.setInputConnection(LineSource1.getOutputPort());
    // appendPolyData.addInputConnection(LineSource2.getOutputPort());
    // appendPolyData.addInputConnection(LineSource3.getOutputPort());
    // // console.log(outData[0]);
    // outData[0] = appendPolyData.getOutputData();
    // console.log(outData[0].getLines().getData());
    // console.log(outData[0].getPoints().getData());
    // // Check input
    // const pointDataType = outData[0]
    //   ? outData[0].getPoints().getDataType()
    //   : 'Float32Array';
    const polyData = vtkPolyData.newInstance();
    const numPts = 6;
    const numLines = 3;
    const newPts = vtkPoints.newInstance({size: numPts * 3});
    //  vtkCellArray is a supporting object that explicitly represents cell
    //  connectivity. The cell array structure is a raw integer list
    //  of the form: (n,id1,id2,...,idn, n,id1,id2,...,idn, ...)
    //  where n is the number of points in the cell, and id is a zero-offset index
    //  into an associated point list.
    const newLines = vtkCellArray.newInstance({size:numLines * (2 + 1)});
    let index = 0;
    newPts.getData()[index * 3 * 2 + 0 + 0] = model.modelBounds[0];
    newPts.getData()[index * 3 * 2 + 1 + 0] = model.focalPoint[1];
    newPts.getData()[index * 3 * 2 + 2 + 0] = model.focalPoint[2];
    newPts.getData()[index * 3 * 2 + 0 + 3] = model.modelBounds[1];
    newPts.getData()[index * 3 * 2 + 1 + 3] = model.focalPoint[1];
    newPts.getData()[index * 3 * 2 + 2 + 3] = model.focalPoint[2];
    newLines.getData()[index * 3 + 0] = 2;
    newLines.getData()[index * 3 + 1] = index * 2 + 0;
    newLines.getData()[index * 3 + 2] = index * 2 + 1;
    ++index;
    newPts.getData()[index * 3 * 2 + 0 + 0] = model.focalPoint[0];
    newPts.getData()[index * 3 * 2 + 1 + 0] = model.modelBounds[2];
    newPts.getData()[index * 3 * 2 + 2 + 0] = model.focalPoint[2];
    newPts.getData()[index * 3 * 2 + 0 + 3] = model.focalPoint[0];
    newPts.getData()[index * 3 * 2 + 1 + 3] = model.modelBounds[3];
    newPts.getData()[index * 3 * 2 + 2 + 3] = model.focalPoint[2];
    newLines.getData()[index * 3 + 0] = 2;
    newLines.getData()[index * 3 + 1] = index * 2 + 0;
    newLines.getData()[index * 3 + 2] = index * 2 + 1;
    ++index;
    newPts.getData()[index * 3 * 2 + 0 + 0] = model.focalPoint[0];
    newPts.getData()[index * 3 * 2 + 1 + 0] = model.focalPoint[1];
    newPts.getData()[index * 3 * 2 + 2 + 0] = model.modelBounds[4];
    newPts.getData()[index * 3 * 2 + 0 + 3] = model.focalPoint[0];
    newPts.getData()[index * 3 * 2 + 1 + 3] = model.focalPoint[1];
    newPts.getData()[index * 3 * 2 + 2 + 3] = model.modelBounds[5];
    newLines.getData()[index * 3 + 0] = 2;
    newLines.getData()[index * 3 + 1] = index * 2 + 0;
    newLines.getData()[index * 3 + 2] = index * 2 + 1;
    ++index;   
    polyData.setPoints(newPts);
    polyData.setLines(newLines);
    outData[0] = polyData;
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  modelBounds: [-1.0, 1.0, -1.0, 1.0, -1.0, 1.0],
  focalPoint: [0.0, 0.0, 0.0],
  pointType: 'Float32Array'
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Build VTK API
  // Cursor3D
  macro.obj(publicAPI, model);
  macro.setGetArray(publicAPI, model, ['modelBounds'], 6);
  macro.setGetArray(publicAPI, model, ['focalPoint'], 3);
  macro.algo(publicAPI, model, 0, 1);
  vtkCursor3D(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkCursor3D');

// ----------------------------------------------------------------------------

export default { newInstance, extend };