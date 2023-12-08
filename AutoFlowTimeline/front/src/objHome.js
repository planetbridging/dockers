import React, {
  useContext,
  Component,
  Suspense,
  useRef,
  useState
} from "react";

import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { Physics, useBox, usePlane } from "@react-three/cannon";
import { useFBX, useProgress, useTexture } from "@react-three/drei";
import { LoadingManager } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  IconButton,
  Box,
  Text,
  Wrap,
  WrapItem,
  Center,
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Stack,
  CircularProgress,
  CircularProgressLabel,
  VStack
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";

import io from "socket.io-client";

import { encrypt, decrypt } from "./crypto";

// Plane functional component
function Plane(props) {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }));
  return (
    <mesh receiveShadow ref={ref}>
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial color="#f0f0f0" />
    </mesh>
  );
}

// Cube functional component
function Cube(props) {
  const [ref] = useBox(() => ({ mass: 1, ...props }));
  return (
    <mesh castShadow ref={ref}>
      <boxGeometry />
      <meshPhongMaterial color="orange" specular={0x555555} shininess={30} />
    </mesh>
  );
}

function FBXModel({ path, scale, position }) {
  const fbx = useLoader(FBXLoader, path);
  return <primitive object={fbx} scale={scale} position={position} />;
}

function FBXModelWithTexture({ path, scale, texturePath, position }) {
  const fbx = useLoader(FBXLoader, path);
  const texture = useTexture(texturePath);

  fbx.traverse((child) => {
    if (child.isMesh) {
      if (child.name === "RoadMeshName") {
        // Replace with your mesh name
        child.material.map = texture;
        child.material.needsUpdate = true;
      }
    }
  });

  return <primitive object={fbx} scale={scale} position={position} />;
}

function Loader() {
  const { progress } = useProgress();

  return (
    <Center height="100vh">
      {" "}
      {/* Full viewport height centering */}
      <CircularProgress value={progress} color="blue.400" size="100px">
        <CircularProgressLabel>
          <Text fontSize="md" fontWeight="bold">
            {Math.round(progress)}%
          </Text>
        </CircularProgressLabel>
      </CircularProgress>
    </Center>
  );
}

function CameraController({ position }) {
  const { camera } = useThree();

  React.useEffect(() => {
    camera.position.set(...position);
    camera.lookAt(0, 0, 0); // Adjust as needed
    camera.updateProjectionMatrix();
  }, [camera, position]);

  return null;
}

const LoadingContext = React.createContext({ setLoading: () => {} });

function TexturedCube({
  position,
  rotation = [0, 0, 0],
  texturePath,
  size = [1, 0.1, 1]
}) {
  const [ref] = useBox(() => ({ position, rotation, args: size }));
  const texture = useTexture(texturePath);

  return (
    <mesh ref={ref} rotation={rotation}>
      <boxGeometry args={size} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

var testing = false;
var chatSocket = null;
var publicSecretKey = "zoomzoom";

if (testing) {
  var ioLocation = "http://localhost:9444";
  chatSocket = io.connect(ioLocation);
} else {
  //ioLocation = "https://tdtplanner.com:5500";
  chatSocket = io.connect();
}

// Main class component
class OHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      isOpen: false,
      loading: true,

      cameraPosition: [-50, 5, 5] // Initial camera position
    };
    this.openDrawer = this.openDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.setLoading = this.setLoading.bind(this);
  }

  componentDidMount() {
    this.timeout = setTimeout(() => this.setState({ ready: true }), 1000);
    document.addEventListener("keydown", this.handleKeyDown);
    this.loadSocket();
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  setLoading(loading) {
    this.setState({ loading });
  }

  async loadSocket() {
    chatSocket.on("gameTick", (data) => {
      console.log(data);
      var de = decrypt(publicSecretKey, data);
      var j = JSON.parse(de);
      console.log(j);
      //var data = j["lstData"];
    });
  }

  // Function to switch camera view
  switchCameraView = (view) => {
    console.log("Changing camera view");
    switch (view) {
      case "top":
        this.setState({ cameraPosition: [-50, 100, 0] }); // Example position for top view
        break;
      case "left":
        this.setState({ cameraPosition: [-50, 30, 0] }); // Example position for left view
        break;
      // ... handle other cases ...
      //default:
      // this.setState({ cameraPosition: [-50, 5, 5] }); // Default position
    }
  };

  handleKeyDown = (event) => {
    const { cameraPosition } = this.state;
    let newPosition = [...cameraPosition];

    switch (event.key) {
      case "w": // move forward
        newPosition[2] -= 1;
        break;
      case "s": // move backward
        newPosition[2] += 1;
        break;
      case "a": // move left
        newPosition[0] -= 1;
        break;
      case "d": // move right
        newPosition[0] += 1;
        break;
      default:
        break;
    }

    this.setState({ cameraPosition: newPosition });
  };

  render() {
    const { ready, isOpen, loading, cameraPosition } = this.state;

    const cubes = [];

    // Generate 100 cubes with random positions
    for (let i = 0; i < 100; i++) {
      // Random position for each cube
      const position = [
        Math.random() * 10, // x position
        Math.random() * 50, // y position (above the plane)
        Math.random() * 10 // z position
      ];

      cubes.push(<Cube key={i} position={position} />);
    }

    return (
      <div className="full-height-canvas">
        <Router>
          <Menu position="fixed" top="0px">
            <Wrap>
              <WrapItem>
                <Button
                  as={IconButton}
                  aria-label="Options"
                  icon={<HamburgerIcon />}
                  variant="outline"
                  onClick={this.openDrawer}
                >
                  Open Drawer
                </Button>

                <Drawer
                  isOpen={isOpen}
                  placement="left"
                  onClose={this.closeDrawer}
                >
                  <DrawerOverlay />
                  <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Menu</DrawerHeader>
                    <DrawerBody>
                      <Stack>
                        <Link to="/training">
                          <Text p="5px">Training</Text>
                        </Link>
                      </Stack>
                    </DrawerBody>
                  </DrawerContent>
                </Drawer>
              </WrapItem>
              <WrapItem>
                <Link to="/">
                  <Text fontSize="2xl" p="5px">
                    Auto Flow Timeline
                  </Text>
                </Link>
              </WrapItem>
            </Wrap>
          </Menu>
          <Box position="absolute" top="50px">
            <Routes>
              <Route
                path="/"
                element={
                  <Stack>
                    <p>ASDW to move camera</p>
                    <Button onClick={() => this.switchCameraView("top")}>
                      Top View
                    </Button>
                    <Button onClick={() => this.switchCameraView("left")}>
                      Left View
                    </Button>
                  </Stack>
                }
              />
              <Route path="/training" element={<p>bob</p>} />
              <Route path="/contact" element={<p>bob</p>} />
            </Routes>
          </Box>
        </Router>
        <Box
          position="absolute"
          top="0px"
          width="100vw"
          height="100vh"
          zIndex={-1}
        >
          <Suspense fallback={<Loader />}>
            <Canvas
              height="100%"
              dpr={[1, 2]}
              shadows
              camera={{ position: cameraPosition, fov: 50 }}
            >
              <CameraController position={cameraPosition} />
              <ambientLight intensity={0.5} />
              <directionalLight
                position={[0, 20, 10]}
                castShadow
                intensity={1.5}
              />

              <Physics>
                <Plane />
                {cubes}
                {ready && <Cube position={[-0.45, 10, 0.25]} />}
                <FBXModel
                  scale={0.1}
                  path="/models/rp_nathan_animated_003_walking.fbx"
                />

                <FBXModel
                  scale={0.1}
                  path="/models/HondaExport.fbx"
                  position={[0, 0, 0]}
                />
                <FBXModel
                  scale={0.1}
                  path="/models/HondaExport.fbx"
                  position={[0, 0, 0]}
                />

                <TexturedCube
                  position={[1, 1, 1]}
                  texturePath="/textures/road.jpg"
                  size={[100, 100, 5]}
                  rotation={[300.01, 0, 0]}
                />
              </Physics>
            </Canvas>
          </Suspense>
        </Box>
      </div>
    );
  }

  openDrawer() {
    this.setState({ isOpen: true });
  }

  closeDrawer() {
    this.setState({ isOpen: false });
  }
}

export default OHome;
