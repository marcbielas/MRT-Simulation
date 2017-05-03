var World = Class.extend({
    // Class constructor
    init: function (args) {
        'use strict';
        // Set the different geometries composing the room
        var ground = new THREE.PlaneGeometry(1000, 1000),
            height = 375,
            walls = [
                    new THREE.PlaneGeometry(ground.height, height),
                    new THREE.PlaneGeometry(ground.width, height),
                    new THREE.PlaneGeometry(ground.height, height),
                    new THREE.PlaneGeometry(ground.width, height)
            ],
            obstacles = [],
            // Set the material, the "skin"
            material = new THREE.MeshLambertMaterial(
                {}),
            i;
            
        // Set the "world" modelisation object
        this.mesh = new THREE.Object3D();
        // Set and add the ground
        this.ground = new THREE.Mesh(ground, material);
        this.ground.rotation.x = -Math.PI / 2;
        this.mesh.add(this.ground);
        // Set and add the walls
        this.walls = [];
        for (i = 0; i < walls.length; i += 1) {
            this.walls[i] = new THREE.Mesh(walls[i], material);
            this.walls[i].position.y = height / 2;
            this.mesh.add(this.walls[i]);
        }
        this.walls[0].rotation.y = -Math.PI / 2;
        this.walls[0].position.x = ground.width / 2;
        this.walls[1].rotation.y = Math.PI;
        this.walls[1].position.z = ground.height / 2;
        this.walls[2].rotation.y = Math.PI / 2;
        this.walls[2].position.x = -ground.width / 2;
        this.walls[3].position.z = -ground.height / 2;
    this.obstacles = [];
        for (i = 0; i < obstacles.length; i += 1) {
            this.obstacles.push(new THREE.Mesh(obstacles[i], material));
            this.mesh.add(this.obstacles[i]);
        }
        //this.obstacles[0].position.set(0, 32, 128);
    },
    getObstacles: function() {
        'use strict';
        return this.obstacles.concat(this.walls);
    }
});