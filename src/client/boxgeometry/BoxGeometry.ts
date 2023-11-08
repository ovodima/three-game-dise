import * as THREE from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils";


const params = {
  segments: 50,
  edgeRadius: 0.17,
  notchRadius: 0.12,
  notchDepth: 0.1,
};

export default class BoxGeometry {
  geometry: THREE.BoxGeometry | THREE.BufferGeometry | null;
  materials: THREE.Group;
  constructor() {
    this.geometry = null;
    this.materials = this.createDiceMesh();
  }

  createDiseGeometry() {
    this.geometry = new THREE.BoxGeometry(
      1,
      1,
      1,
      params.segments,
      params.segments,
      params.segments
    );

    const positionAttr = this.geometry.attributes.position;
    const subCubeHalfSize = 0.5 - params.edgeRadius;
    const normalAtribbute = this.geometry.attributes.normal;

    for (let i = 0; i < positionAttr.count; i++) {
      let position = new THREE.Vector3().fromBufferAttribute(positionAttr, i);

      const subCube = new THREE.Vector3(
        Math.sign(position.x),
        Math.sign(position.y),
        Math.sign(position.z)
      ).multiplyScalar(subCubeHalfSize);
      const addition = new THREE.Vector3().subVectors(position, subCube);

      if (
        Math.abs(position.x) > subCubeHalfSize &&
        Math.abs(position.y) > subCubeHalfSize &&
        Math.abs(position.z) > subCubeHalfSize
      ) {
        addition.normalize().multiplyScalar(params.edgeRadius);
        position = subCube.add(addition);
      } else if (
        Math.abs(position.x) > subCubeHalfSize &&
        Math.abs(position.y) > subCubeHalfSize
      ) {
        addition.z = 0;
        addition.normalize().multiplyScalar(params.edgeRadius);
        position.x = subCube.x + addition.x;
        position.y = subCube.y + addition.y;
      } else if (
        Math.abs(position.x) > subCubeHalfSize &&
        Math.abs(position.z) > subCubeHalfSize
      ) {
        addition.y = 0;
        addition.normalize().multiplyScalar(params.edgeRadius);
        position.x = subCube.x + addition.x;
        position.z = subCube.z + addition.z;
      } else if (
        Math.abs(position.y) > subCubeHalfSize &&
        Math.abs(position.z) > subCubeHalfSize
      ) {
        addition.x = 0;
        addition.normalize().multiplyScalar(params.edgeRadius);
        position.y = subCube.y + addition.y;
        position.z = subCube.z + addition.z;
      }

      const notchWave = (v: number) => {
        v = (1 / params.notchRadius) * v;
        v = Math.PI * Math.max(-1, Math.min(1, v));
        return params.notchDepth * (Math.cos(v) + 1);
      };
      const notch = (pos: number[]) => notchWave(pos[0]) * notchWave(pos[1]);

      const offset = 0.23;

      if (position.y === 0.5) {
        position.y -= notch([position.x, position.z]);
      } else if (position.x === 0.5) {
        position.x -= notch([position.y + offset, position.z + offset]);
        position.x -= notch([position.y - offset, position.z - offset]);
      } else if (position.z === 0.5) {
        position.z -= notch([position.x - offset, position.y + offset]);
        position.z -= notch([position.x, position.y]);
        position.z -= notch([position.x + offset, position.y - offset]);
      } else if (position.z === -0.5) {
        position.z += notch([position.x + offset, position.y + offset]);
        position.z += notch([position.x + offset, position.y - offset]);
        position.z += notch([position.x - offset, position.y + offset]);
        position.z += notch([position.x - offset, position.y - offset]);
      } else if (position.x === -0.5) {
        position.x += notch([position.y + offset, position.z + offset]);
        position.x += notch([position.y + offset, position.z - offset]);
        position.x += notch([position.y, position.z]);
        position.x += notch([position.y - offset, position.z + offset]);
        position.x += notch([position.y - offset, position.z - offset]);
      } else if (position.y === -0.5) {
        position.y += notch([position.x + offset, position.z + offset]);
        position.y += notch([position.x + offset, position.z]);
        position.y += notch([position.x + offset, position.z - offset]);
        position.y += notch([position.x - offset, position.z + offset]);
        position.y += notch([position.x - offset, position.z]);
        position.y += notch([position.x - offset, position.z - offset]);
      }

      positionAttr.setXYZ(i, position.x, position.y, position.z);
      normalAtribbute.setXYZ(i, position.x, position.y, position.z);
    }

    this.geometry.deleteAttribute("normal");
    this.geometry.deleteAttribute("uv");

    this.geometry = BufferGeometryUtils.mergeVertices(this.geometry);

    this.geometry.computeVertexNormals();

    return this.geometry;
  }

  createInnerGeometry() {
    const baseGeometry = new THREE.PlaneGeometry(
      1 - 2 * params.edgeRadius,
      1 - 2 * params.edgeRadius
    );

    // place planes a bit behind the box sides
    const offset = 0.48;

   

    return BufferGeometryUtils.mergeBufferGeometries(
      [
        baseGeometry.clone().translate(0, 0, offset),
        baseGeometry.clone().translate(0, 0, -offset),
        baseGeometry
          .clone()
          .rotateX(0.5 * Math.PI)
          .translate(0, -offset, 0),
        baseGeometry
          .clone()
          .rotateX(0.5 * Math.PI)
          .translate(0, offset, 0),
        baseGeometry
          .clone()
          .rotateY(0.5 * Math.PI)
          .translate(-offset, 0, 0),
        baseGeometry
          .clone()
          .rotateY(0.5 * Math.PI)
          .translate(offset, 0, 0),
      ],
      false
    );
  }

  createDiceMesh() {
    const boxMaterialOuter = new THREE.MeshStandardMaterial({
      color: 0xf8f8f8,
    });
    const boxMaterialInner = new THREE.MeshStandardMaterial({
      color: 0xf8f8f8,
      roughness: 0,
      metalness: 1,
      side: THREE.DoubleSide,
    });

    const diceMesh = new THREE.Group();
    const innerMesh = new THREE.Mesh(
      this.createInnerGeometry(),
      boxMaterialInner
    );
    const outerMesh = new THREE.Mesh(
      this.createDiseGeometry(),
      boxMaterialOuter
    );
    diceMesh.add(innerMesh, outerMesh);

    return diceMesh;
  }

  renderCube() {
    return this.createDiceMesh();
  }
}