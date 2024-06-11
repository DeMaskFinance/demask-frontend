import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim"; // Use the slim version for reduced bundle size

const BackgroundParticles = (props: any) => {
  const [init, setInit] = useState(false);

  // this should be run only once per application lifetime
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
      // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
      // starting from v2 you can add only the features you need reducing the bundle size
      //await loadAll(engine);
      //await loadFull(engine);
      await loadSlim(engine);
      //await loadBasic(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = (container: any): any => {
    console.log(container);
  };

  return (
    <div>
      {init && (
        <Particles
          id="tsparticles"
          particlesLoaded={particlesLoaded}
          options={{
            particles: {
              number: {
                value: 200,
                density: {
                  enable: true,
                },
              },
              color: {
                value: "#ffffff",
              },
              shape: {
                type: "circle",
                options: {
                  polygon: {
                    sides: 5,
                  },
                  image: {
                    src: "img/github.svg",
                    width: 100,
                    height: 100,
                    replaceColor: false,
                  },
                },
              },
              stroke: {
                width: 0,
                color: "#ffffff",
              },
              opacity: {
                value: { min: 0.1, max: 1 },
                animation: {
                  enable: true,
                  destroy: "none",
                  speed: 1,
                  sync: false,
                  startValue: "random",
                  mode: "random",
                },
              },
              size: {
                value: { min: 0.1, max: 2 },
                animation: {
                  enable: true,
                  speed: 10,
                  sync: false,
                  mode: "random",
                },
              },
              line_linked: {
                enable: false,
                distance: 150,
                color: "#ffffff",
                opacity: 0.4,
                width: 1,
              },
              move: {
                enable: true,
                speed: 0.1,
                direction: "none",
                random: true,
                straight: false,
                outModes: "bounce",
                attract: {
                  enable: true,
                },
              },
            },
            interactivity: {
              detect_on: "canvas",
              events: {
                resize: {
                  enable: true,
                },
              },
              modes: {
                grab: {
                  distance: 400,
                  line_linked: {
                    opacity: 1,
                  },
                },
                bubble: {
                  distance: 23,
                  size: 4,
                  duration: 3,
                  opacity: 1,
                  speed: 3,
                },
                repulse: {
                  distance: 200,
                  duration: 0.4,
                },
                push: {
                  particles_nb: 4,
                },
                remove: {
                  particles_nb: 2,
                },
              },
            },
            retina_detect: true,
          }}
        />
      )}
    </div>
  );
};

export default BackgroundParticles;
