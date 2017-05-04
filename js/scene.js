var basicScene;
var BasicScene = Class.extend({
    // Class constructor
    init: function() {
        'use strict';

        // Create a scene, a camera, a light and a WebGL renderer with Three.JS
        this.scene = new THREE.Scene();

        var VIEW_WIDTH = 800;
        var VIEW_HEIGHT = 400;
        var VIEW_ANGLE = 45;
        var ASPECT = VIEW_WIDTH / VIEW_HEIGHT;
        var NEAR = 0.1;
        var FAR = 20000;

        this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

        //this.scene.add(this.camera);
        this.light = new THREE.PointLight();
        this.light.position.set(-256, 256, -256);
        this.scene.add(this.light);
        this.renderer = new THREE.WebGLRenderer();

        // Define the container for the renderer
        this.container = jQuery('#basic-scene');

        // Create the user's character
        this.user = new Character({
            color: 0x7A43B6
        });

        this.scene.add(this.user.mesh);

        this.user.mesh.add(this.camera);

        // Create the "world" : a 3D representation of the place we'll be putting our character in
        this.world = new World({
            color: 0xF5F5F5
        });
        this.scene.add(this.world.mesh);

        // Define the size of the renderer
        this.setAspect();

        // Insert the renderer in the container
        this.container.prepend(this.renderer.domElement);

        // Set the camera to look at our user's character
        this.setFocus(this.user.mesh);

        // Start the events handlers
        this.setControls();
    },
    // Event handlers
    setControls: function() {
        'use strict';

        // Within jQuery's methods, we won't be able to access "this"
        var user = this.user;

        // State of the different controls
        var controls = {
            left: false,
            up: false,
            right: false,
            down: false
        };
        
        user.controls = controls;

        // When the user push a key down
        jQuery(document).keydown(function(e) {
            var prevent = true;

            // Update the state of the attached control to "true"
            switch (e.keyCode) {
                case 37:
                case 65:
                    controls.left = true;
                    break;
                case 38:
                case 87:
                    controls.up = true;
                    break;
                case 39:
                case 68:
                    controls.right = true;
                    break;
                case 40:
                case 83:
                    controls.down = true;
                    break;
                default:
                    prevent = false;
            }

            // Avoid the browser to react unexpectedly
            if (prevent) {
                e.preventDefault();
            } else {
                return;
            }

            // Update the character's direction
            user.setDirection(controls);
        });

        // When the user release a key up
        jQuery(document).keyup(function(e) {
            var prevent = true;

            // Update the state of the attached control to "false"
            switch (e.keyCode) {
                case 37:
                case 65:
                    controls.left = false;
                    break;
                case 38:
                case 87:
                    controls.up = false;
                    break;
                case 39:
                case 68:
                    controls.right = false;
                    break;
                case 40:
                case 83:
                    controls.down = false;
                    break;
                default:
                    prevent = false;
            }

            // Avoid the browser to react unexpectedly
            if (prevent) {
                e.preventDefault();
            } else {
                return;
            }

            // Update the character's direction
            user.setDirection(controls);
        });

        // On resize
        jQuery(window).resize(function() {

            // Redefine the size of the renderer
            basicScene.setAspect();
        });
    },
    // Defining the renderer's size
    setAspect: function() {
        'use strict';

        // Fit the container's full width
        var w = 800,
                // Fit the initial visible area's height
                h = 400;

        // Update the renderer and the camera
        this.renderer.setSize(w, h);
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
    },
    // Updating the camera to follow and look at a given Object3D / Mesh
    setFocus: function(object) {
        'use strict';

        if (($('input[name=camera]:checked').val()) == "plan")
        {
            this.camera.position.set(0, 4000, 0);
            this.camera.lookAt(new THREE.Vector3(0,0,0));
        }
        else {
            this.camera.position.set(object.position.x, object.position.y + 128, object.position.z -1000);
            this.camera.lookAt(object.position);
        }
       // console.log(object.position);

    },
    computeMRT: function(user) {
        'use strict';
        var height = 375 
        var width = 1000; 
        var length = 1000;
        //place corner of room on 0,0
        var x = user.position.x + 500;
        var y = 125; //mid-height of human
        var z = user.position.z + 500;
        if (($('input[name=sitting]:checked').val()) == "yes")
        {
            y *=(2.0/3.0); //height of seated person is 2/3 standing person
        }

        var floorangle = calculate_wall_angle(x, z, y, width, length, height);
        var ceilingangle = calculate_wall_angle(x, z, (height - y), width, length, height);
        var frontangle = calculate_wall_angle(x, y, z, width, height, length);
        var backangle = calculate_wall_angle(x, y, (length - z), width, height, length);
        var leftangle = calculate_wall_angle(z, y, x, length, height, width);
        var rightangle = calculate_wall_angle(z, y, (width - x), length, height, width);

        var totalangle = ceilingangle+floorangle+frontangle+backangle+leftangle+rightangle;

        //to percentage (total angle = 1)
        floorangle = floorangle/totalangle;
        ceilingangle = ceilingangle/totalangle;
        frontangle = frontangle/totalangle;
        backangle = backangle/totalangle;
        leftangle = leftangle/totalangle;
        rightangle = rightangle/totalangle;

        //import temps

        var ceilingtemp = $('#ceiling-temp').val();
        var fronttemp = $('#front-temp').val();
        var lefttemp = $('#left-temp').val();
        var floortemp = $('#floor-temp').val();
        var righttemp = $('#right-temp').val();
        var backtemp = $('#back-temp').val();

        //set up temp ^ 4 * radiant angle

        var ceiling = ceilingangle * Math.pow(ceilingtemp, 4);
        var front = frontangle * Math.pow(fronttemp, 4);
        var left = leftangle * Math.pow(lefttemp, 4);
        var floor = floorangle * Math.pow(floortemp, 4);
        var right = rightangle * Math.pow(righttemp, 4);
        var back = backangle * Math.pow(backtemp, 4);

        //calculate MRT

        var mrt = Math.pow((ceiling + front + left + floor + right + back), 0.25);

        $('#mrt').val(mrt);
    },
    // Update and draw the scene
    frame: function() {
        'use strict';
        // Run a new step of the user's motions
        this.user.motion();
        
        this.setFocus(this.user.mesh)
        // And draw !
        this.computeMRT(this.user.mesh)
        this.renderer.render(this.scene, this.camera);
    }
});
