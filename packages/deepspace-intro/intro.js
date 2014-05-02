DS.Intro = function(){

    var camera, scene, particles, lines, material, renderer, x, y, count, status, cursor;
    var PI2 = Math.PI * 2;

    //settings
    var settings = {
        delta: 100,
        qx: 100,
        qy: 50,
        lines: 75
    };

    //render loop
    DS.THREE.renderManager.call(this);

    //camera
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 1000;
    x = 0;
    y = -(window.innerWidth/2);

    //add scene
    scene = new THREE.Scene();
    particles = new Array();
    count = 0;
    status= 0;

    //position
    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    //make particle material
    material = new THREE.SpriteCanvasMaterial( {

        color: 0x000000,
        program: function ( context ) {

            context.beginPath();
            context.arc( 0, 0, 1, 0, PI2, true );
            context.fill();

        }

    } );

    //add particles
    var i = 0;
    var particle;

    for ( var ix = 0; ix < settings.qx; ix ++ ) {

        for ( var iy = 0; iy < settings.qy; iy ++ ) {

            particle = particles[ i ++ ] = new THREE.Sprite( material );
            particle.position.x = ix * settings.delta - ( ( settings.qx * settings.delta ) / 2 );
            particle.position.z = iy * settings.delta - ( ( settings.qy * settings.delta ) / 2 );
            scene.add( particle );

        }

    }

    //get neighbour
    var getNeighbour = function(){
        
    }

    //add lines
    var lines = [];
    cursor = 0;
    for ( var i = 0 ; i < settings.lines ; i++){

        var geometry = new THREE.Geometry();
        var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0x000000, opacity: 1, linewidth: 1 } ) );
		scene.add( line );
        lines.push( line )

        //get source and target
        var nr = Math.floor(Math.random()*particles.length);
        line.source = particles[nr];
        line.target = particles[nr+1];

        line.geometry.vertices.push(line.source.position, line.target.position);

    }

    //add to DOM
    renderer = new THREE.CanvasRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor(0xFFFFFF);
    $('#intro .background').append( renderer.domElement );

    //animation loop
    this.addProcess('intro', function(delta){

        var full = (window.innerHeight * 0.75) * status;
        y = (0 - window.innerHeight / 2) + full;

        camera.position.x += ( x - camera.position.x ) * .05;
        camera.position.y += ( - y - camera.position.y ) * .05;
        camera.lookAt( scene.position );

        var i = 0;

        //particles
        for ( var ix = 0; ix < settings.qx; ix ++ ) {

            for ( var iy = 0; iy < settings.qy; iy ++ ) {

                particle = particles[ i++ ];
                particle.position.y = ( Math.sin( ( ix + count ) * 0.3 ) * 50 ) + ( Math.sin( ( iy + count ) * 0.5 ) * 50 );
                particle.scale.x = particle.scale.y = ( Math.sin( ( ix + count ) * 0.3 ) + 1 ) * 2 + ( Math.sin( ( iy + count ) * 0.5 ) + 1 ) * 2;

            }

        }

        //lines
        var nr = Math.floor(Math.random()*particles.length);
        lines[cursor].source = particles[nr];
        lines[cursor].target = particles[nr+1];

        //move pointer
        cursor++;
        if(cursor >= settings.lines) cursor = 0;

        //animate lines
        for ( var l = 0 ; l < lines.length ; l++ ){


            lines[l].geometry.vertices[0] = lines[l].source.position;
            lines[l].geometry.vertices[1] = lines[l].target.position;

        }

        renderer.render( scene, camera );

        count += 0.1;

    });

    //scroll
    /*
    var bg = 1;
    $(window).mousewheel(function(event, delta) {

        $body = $('#intro');

        //move deeper in the sea
		status += delta * -0.01;
        if(status < 0) status = 0;

        //animate bg
        bg += delta/200;
        if(bg < 0) bg = 0;
        var color = new THREE.Color(bg,bg,bg);
        //renderer.setClearColor(color.getHex());

	}); */

    //check if mobile
    if(Session.get('mobile')){
        this.stop();
    }

    this.destruct = function(){
        this.stop();
        //todo remove canvas
    };

}
