/**
 * Created by marko on 08/10/16.
 */
var app = {
    alturaMaxima: 10,
    reiniciar: function(){
        alert("apreto reiniciar");
    },
    detener: function(){
        alert("apreto detener");
    },
    modo: "random",
    ancho: 0,
    umbral: 100

};

function GUI (){
    var gui = new dat.GUI();

    var f1 = gui.addFolder('Comandos');
    f1.add(app, 'reiniciar').name("Reiniciar");
    f1.add(app, 'detener').name("detener");
    f1.open();

    var f2 = gui.addFolder('Parametros generales');

    f2.add(app, 'alturaMaxima', 1.0, 60.0).name("altura maxima").step(1);
    f2.add(app, 'ancho',4,25).name("Ancho");

    f2.add(app, 'modo',["random","secuencial"]).name("modo");

    var f3 = gui.addFolder('Parametros Especiales ');
    f3.add(app,'umbral',0.0,1.0).name("umbral");

    f1.open();
    f2.open();
    f3.open();

    gui.close();
}