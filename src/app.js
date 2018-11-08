// react 
import React from 'react'
// vtk



import vtkOpenGLRenderWindow from 'vtk.js/Sources/Rendering/OpenGL/RenderWindow';
import vtkRenderWindow from 'vtk.js/Sources/Rendering/Core/RenderWindow';
import vtkGenericRenderWindow from 'vtk.js/Sources/Rendering/Misc/GenericRenderWindow'
import vtkRenderWindowInteractor from 'vtk.js/Sources/Rendering/Core/RenderWindowInteractor';
import vtkRenderer from 'vtk.js/Sources/Rendering/Core/Renderer';
import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper'
import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor'
export default class App extends React.Component
{
    constructor(props)
    {
        super(props);
        this.divRef = React.createRef();
    }

    render()
    {
        return React.createElement('div', {ref: this.divRef});
    }

    componentDidMount()
    {
        const genericRenderWindow = vtkGenericRenderWindow.newInstance();
        genericRenderWindow.setContainer(this.divRef.current);



        const mapper = vtkMapper.newInstance();

    }
}