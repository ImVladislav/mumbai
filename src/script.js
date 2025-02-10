/* 
 * Data driven stylized Globe using WebGL and THREE.js
 *
 * Script: https://static.redsift.io/three/t3-rs-geo/latest/t3-rs-geo.umd-es2015.min.js
 * Component Github: https://github.com/redsift/t3-rs-geo
 *
 * Demo: Locations, Pan, Zoom, Animation
 */
const initialData = [
    { lat:25.77427, lng:-80.19366,  label:"Miami"   },
    { lat:37.77493, lng:-122.41942, label:"San Francisco"   },
    { lat:-23.5475, lng:-46.63611,   label:"Sao Paulo"      },
    { lat:-12.04318,lng:-77.02824,  label:"Lima"    },
    { lat:21.30694, lng:-157.85833, label:"Honolulu"},
    { lat:-31.95224,lng:115.8614,   label:"Perth"   },
    { lat:-33.86785,lng:151.20732,  label:"Sydney"  },
    { lat: -42,     lng: 174,       label:"New Zealand" },
    { lat:22.28552, lng:114.15769,  label:"Hong Kong"   },
    { lat:30.06263, lng:31.24967,   label:"Cairo"   },
    { lat:-33.92584,lng:18.42322,   label:"Cape Town"   },
    { lat:55.75222, lng:37.61556,   label:"Moscow"      },        
];

d3.json('//static.redsift.io/three/t3-rs-geo/latest/grid-hq.json', function(world) {
  const node = d3.select('#elm').node();

  const globe = new t3_rs_geo.Globe(node.clientWidth, node.clientHeight, {
      data: initialData,
      tiles: world.tiles,
      font: 'Raleway'
  });

  node.append(globe.domElement);

  globe.ready
  .then(() => {
      // we are ready

      (function tick() {
          globe.tick();
          requestAnimationFrame(tick);
      })();

      setTimeout(function(){
          globe.addMarker(51.5074, -0.1278, "London");
          globe.addMarker(50.1109, 8.6821, "Frankfurt", true);
      }, 2000);  
      setTimeout(function(){
          globe.addMarker(19.07283, 72.88261, "Mumbai", true);
      }, (2000 + 5000));  

      // Handle window resize events
      window.addEventListener('resize', 
                  (onWindowResize) => globe.resize(node.clientWidth, node.clientHeight)
                  , false);

      let autoRotate;
      let autoDayLength = globe.dayLength
      // Handle dragging
      d3.selectAll('#elm > canvas')
      .call(d3.drag()
          .on('start', () => {
              // stop the auto-rotation
              clearTimeout(autoRotate);
              globe.dayLength = 0;
              // stop the trails
              globe.smoke(false);
          })
          .on('drag', () => {
              globe.cameraAngle += (d3.event.dx * 0.001); //TODO: ratio
              let newA = globe.viewAngle + (d3.event.dy * 0.001); 
              globe.viewAngle = Math.max(Math.min(newA, Math.PI / 2.0), -Math.PI / 2.0);
          })
          .on('end', () => {
              // Start spinning again after 3 seconds
              autoRotate = setTimeout(() => { 
                  globe.dayLength = autoDayLength; 
                  globe.smoke(true);
              }, 3000);
          })
      )
      .call(d3.zoom()
          .scaleExtent([ 0.77, 2 ])
          .on('zoom', () => {
              globe.setScale(d3.event.transform.k);
          })
      );
  })
  .catch(e => console.error(e));
});