var World = Class.extend({
    // Class constructor
    init: function (args) {
        'use strict';
        // Set the different geometries composing the room
        var ground = new THREE.PlaneGeometry(1000, 1000, 10, 10),
            height = 375,
            walls = [
                    new THREE.PlaneGeometry(ground.height, height),
                    new THREE.PlaneGeometry(ground.width, height),
                    new THREE.PlaneGeometry(ground.height, height),
                    new THREE.PlaneGeometry(ground.width, height)
            ],
            obstacles = [],
            // Set the material, the "skin"
            leftmaterial = new THREE.MeshLambertMaterial(
                {color: 0xff0000}),
            frontmaterial = new THREE.MeshLambertMaterial(
                {color: 0x00ff00}),
            rightmaterial = new THREE.MeshLambertMaterial(
                {color: 0x0000ff}),
            backmaterial = new THREE.MeshLambertMaterial(
                {color: 0xff00ff}),
            i;
        var floormaterials = []; 
        floormaterials.push( new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide }) );
        floormaterials.push( new THREE.MeshBasicMaterial( { color: 0x000000, side: THREE.DoubleSide }) );
        var l = ground.faces.length / 2;

        for( var i = 0; i < l; i ++ ) {
            var j = i * 2; 
            ground.faces[ j ].materialIndex = ((i + Math.floor(i/10)) % 2); 
            ground.faces[ j + 1 ].materialIndex = ((i + Math.floor(i/10)) % 2); 
        }


            
        // Set the "world" modelisation object
        this.mesh = new THREE.Object3D();
        // Set and add the ground
        this.ground = new THREE.Mesh( ground, new THREE.MeshFaceMaterial( floormaterials ) );
        this.ground.rotation.x = -Math.PI / 2;
        this.mesh.add(this.ground);
        // Set and add the walls
        this.walls = [];
        this.walls[0] = new THREE.Mesh(walls[0], leftmaterial);
        this.walls[1] = new THREE.Mesh(walls[1], frontmaterial);
        this.walls[2] = new THREE.Mesh(walls[2], rightmaterial);
        this.walls[3] = new THREE.Mesh(walls[3], backmaterial);

        for (i = 0; i < walls.length; i += 1) {
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