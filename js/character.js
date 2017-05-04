var Character = Class.extend({
    // Class constructor
    init: function (args) {
        'use strict';
        // Set the different geometries composing the humanoid
        this.WALK_SPEED = 10;
        this.ROTATION_SPEED = 0.03;
        //create torso shape
        var torsoplan = new THREE.Shape();
        torsoplan.moveTo(0,0);
        torsoplan.lineTo(0, 90);
        torsoplan.lineTo(-15, 90);
        torsoplan.lineTo(-15, 100);
        torsoplan.lineTo(75, 100);
        torsoplan.lineTo(75, 90);
        torsoplan.lineTo(60, 90);
        torsoplan.lineTo(60, 0);
        torsoplan.lineTo(0, 0);

        var extrudeSettings = {
            steps: 1,
            amount: 20, //revise
            bevelEnabled: true,
            bevelThickness: 10,
            bevelSize: 5,
            bevelSegments: 40
        };

        var torso = new THREE.ExtrudeGeometry(torsoplan, extrudeSettings),
            head = new THREE.SphereGeometry(20, 20, 20),
            arm = new THREE.CylinderGeometry(7, 4, 100, 20),
            //hand = new THREE.SphereGeometry(8, 4, 4),
            leg = new THREE.CylinderGeometry(10, 5, 110, 20),
            //foot = new THREE.SphereGeometry(20, 4, 4, 0, Math.PI * 2, 0, Math.PI / 2),
            nose = new THREE.SphereGeometry(4, 4, 4),
            // Set the material, the "skin"
            material = new THREE.MeshLambertMaterial({color: 0xffffff});

        arm.applyMatrix(new THREE.Matrix4().makeTranslation( 0, -50, 0 ) );
        leg.applyMatrix( new THREE.Matrix4().makeTranslation( 0, -50, 0 ) );

        // Set the character modelisation object
        this.mesh = new THREE.Object3D();
        this.mesh.position.y = 0;
        // Set and add its head
        this.head = new THREE.Mesh(head, material);
        this.head.position.y = 230;
        this.mesh.add(this.head);
        // Set and add its hands
        this.torso = new THREE.Mesh(torso, material);
        this.torso.position.y = (100);
        this.torso.position.x =-30;
        this.torso.position.z = -12.5;
        this.mesh.add(this.torso);
        this.arms = {
            left: new THREE.Mesh(arm, material),
            right: new THREE.Mesh(arm, material)
        }
        this.arms.left.position.x = -42;
        this.arms.left.position.y = 190;
        this.arms.right.position.x = 42;
        this.arms.right.position.y = 190;
        // this.arms.left.rotation.z = -Math.PI/16;
        // this.arms.right.rotation.z = Math.PI/16;
        this.mesh.add(this.arms.left);
        this.mesh.add(this.arms.right);

        this.legs = {
            left: new THREE.Mesh(leg, material),
            right: new THREE.Mesh(leg, material)
        };
        this.legs.left.position.x = -20;
        this.legs.left.position.y = 100;
        this.legs.right.position.x = 20;
        this.legs.right.position.y = 100;
        this.mesh.add(this.legs.left);
        this.mesh.add(this.legs.right);

        // Set and add its nose
        this.nose = new THREE.Mesh(nose, material);
        this.nose.position.y = 230;
        this.nose.position.z = 20;
        this.mesh.add(this.nose);

        // dummy user for collision detection
        // is always at the users location and
        // the dummy performs all movement before the user
        // to check that a collision isn't eminent. if it is
        // the user isn't allowed to take the next step
        this.dummyMesh = new THREE.Object3D();

        // Set the vector of the current motion
        this.direction = new THREE.Vector3(0, 0, 0);

        // Set the current animation step
        this.step = 0;

        // And the "RayCaster", able to test for intersections
        this.caster = new THREE.Raycaster();
    },
    // Update the direction of the current motion
    setDirection: function(controls) {
        'use strict';

        // Either left or right, and either up or down (no jump or dive (on the Y axis), so far ...)
        var x = controls.left ? 1 : controls.right ? -1 : 0,
                y = 0,
                z = controls.up ? 1 : controls.down ? -1 : 0;

        this.direction.set(x, y, z);
    },
    // Process the character motions
    motion: function() {
        'use strict';

        // Update the directions if we intersect with an obstacle
        var freeToMove = this.collision();

        if (($('input[name=sitting]:checked').val()) == "yes")
        {
           this.legs.left.rotation.setX(-Math.PI/2);
           this.legs.right.rotation.setX(-Math.PI/2);
           //this.mesh.rotation.setY(Math.PI/2);
        }

        // If we're not static
        if (this.controls.up || this.controls.down || this.controls.left || this.controls.right) {

            // Rotate the character
            this.rotate();

            // Move the character
            if (freeToMove) {
                this.move();
            }
        }
    },
    // Test and avoid collisions
    collision: function() {
        'use strict';

        this.dummyMesh.position.x = this.mesh.position.x;
        this.dummyMesh.position.y = this.mesh.position.y;
        this.dummyMesh.position.z = this.mesh.position.z;

        this.dummyMesh.rotation.x = this.mesh.rotation.x;
        this.dummyMesh.rotation.y = this.mesh.rotation.y;
        this.dummyMesh.rotation.z = this.mesh.rotation.z;

        if (this.controls.up) {
            this.dummyMesh.translateZ(this.WALK_SPEED);
        } else if (this.controls.down) {
            this.dummyMesh.translateZ(-this.WALK_SPEED);
        }

        // Maximum distance from the origin before we consider collision
        var distance = 64;

        // Get the obstacles array from our world
        var obstacles = basicScene.world.getObstacles();

        // We only need to check the direction we're moving
        this.caster.set(this.dummyMesh.position, new THREE.Vector3(this.dummyMesh.position.x, this.dummyMesh.position.y, this.dummyMesh.position.z));

        // Test if we intersect with any obstacle mesh
        var collisions = this.caster.intersectObjects(obstacles);

        // And disable that direction if we do
        if (collisions.length > 0 && collisions[0].distance <= distance) {
            return false;
        } else {
            return true;
        }
    },
    // Rotate the character
    rotate: function() {
        'use strict';
                if (($('input[name=sitting]:checked').val()) == "yes")
        {
            //do nothing
        }

        else
        {
            if (this.controls.left) {
                this.mesh.rotation.y += this.ROTATION_SPEED;
            } else if (this.controls.right) {
                this.mesh.rotation.y -= this.ROTATION_SPEED;
            }
        }
    },
    move: function() {
        'use strict';
        if (($('input[name=sitting]:checked').val()) == "yes")
        {
           // do nothing
        }

        else
        {
            if (this.controls.up) {
                this.mesh.translateZ(this.WALK_SPEED);
            } else if (this.controls.down) {
                this.mesh.translateZ(-this.WALK_SPEED);
            }
            // Now some animation trigonometry, using our "step" property ...
            this.step += 0.25;

            // Move legs, head, arms and torso
            this.legs.left.rotation.setX(Math.sin(this.step) / 2);
            this.legs.right.rotation.setX(Math.cos(this.step + (Math.PI / 2)) / 2);
            this.head.translateY(Math.sin(this.step) / 2);
            this.torso.translateY(-Math.sin(this.step) / 2);
            this.arms.left.rotation.setX(Math.sin(-this.step) / 2);
            this.arms.right.rotation.setX(Math.cos(this.step - (Math.PI / 2)) / 2);
        }
    },
});