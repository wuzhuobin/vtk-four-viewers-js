// react
import React from 'react'
import ReactDOM from 'react-dom'
// vtk
import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkConeSource from 'vtk.js/Sources/Filters/Sources/ConeSource';
import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper';
import vtkOpenGLRenderWindow from 'vtk.js/Sources/Rendering/OpenGL/RenderWindow';
import vtkRenderWindow from 'vtk.js/Sources/Rendering/Core/RenderWindow';
import vtkRenderWindowInteractor from 'vtk.js/Sources/Rendering/Core/RenderWindowInteractor';
import vtkRenderer from 'vtk.js/Sources/Rendering/Core/Renderer';
import vtkInteractorStyleTrackballCamera from 'vtk.js/Sources/Interaction/Style/InteractorStyleTrackballCamera';
export default class App extends React.Component
{
    constructor(props)
    {
        super(props);
        this.fourViewers = React.createElement(vtkFourViewers, this.props.root);
    }
    render()
    {
        return React.createElement('div', null, React.createElement(vtkFourViewers, {root: this.props.root}));
    }
}

class vtkFourViewers extends React.Component
{
    constructor(props)
    {
        super(props);
        this.gridContainer = {
            display: 'grid',
            gridTemplateColumns: '800px 800px',
            gridTemplateRows: '450px 450px',
            // backgroundColor: '#2196F3',
            padding: '10px'
        };
        this.divRef = React.createRef();
    }

    render() {
        return React.createElement('div', {style: this.gridContainer}, 
            React.createElement(Viewer),
            React.createElement(Viewer),
            React.createElement(Viewer),
            React.createElement(Viewer),
        );
    }
}

class Viewer extends React.Component
{
    constructor(props)
    {
        super(props);
        this.gridItem = {
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            border: '1px solid rgba(0, 0, 0, 0.8)',
            padding: '20px',
            fontSize: '30px',
            textAlign: 'center'
        };
        this.divRef = React.createRef();
    }
    render()
    {
        return React.createElement('div', {style: this.gridItem, ref: this.divRef});
    }

    componentDidMount()
    {
        // ----------------------------------------------------------------------------
        // Standard rendering code setup
        // ----------------------------------------------------------------------------

        const renderWindow = vtkRenderWindow.newInstance();
        const renderer = vtkRenderer.newInstance({ background: [0.2, 0.3, 0.4] });
        renderWindow.addRenderer(renderer);

        // ----------------------------------------------------------------------------
        // Simple pipeline ConeSource --> Mapper --> Actor
        // ----------------------------------------------------------------------------

        const coneSource = vtkConeSource.newInstance({ height: 1.0 });

        const mapper = vtkMapper.newInstance();
        mapper.setInputConnection(coneSource.getOutputPort());

        const actor = vtkActor.newInstance();
        actor.setMapper(mapper);

        // ----------------------------------------------------------------------------
        // Add the actor to the renderer and set the camera based on it
        // ----------------------------------------------------------------------------

        renderer.addActor(actor);
        renderer.resetCamera();

        // ----------------------------------------------------------------------------
        // Use OpenGL as the backend to view the all this
        // ----------------------------------------------------------------------------

        const openglRenderWindow = vtkOpenGLRenderWindow.newInstance();
        renderWindow.addView(openglRenderWindow);

        // ----------------------------------------------------------------------------
        // Create a div section to put this into
        // ----------------------------------------------------------------------------
        openglRenderWindow.setContainer(this.divRef.current);

        // ----------------------------------------------------------------------------
        // Capture size of the container and set it to the renderWindow
        // ----------------------------------------------------------------------------

        const { width, height } = this.divRef.current.getBoundingClientRect();
        openglRenderWindow.setSize(width, height);

        // ----------------------------------------------------------------------------
        // Setup an interactor to handle mouse events
        // ----------------------------------------------------------------------------

        const interactor = vtkRenderWindowInteractor.newInstance();
        interactor.setView(openglRenderWindow);
        interactor.initialize();
        interactor.bindEvents(this.divRef.current);

        // ----------------------------------------------------------------------------
        // Setup interactor style to use
        // ----------------------------------------------------------------------------

        interactor.setInteractorStyle(vtkInteractorStyleTrackballCamera.newInstance());
    }
}