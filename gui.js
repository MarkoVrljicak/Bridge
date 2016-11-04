function GUI (){
    var gui = new dat.GUI();

    var f1 = gui.addFolder('Commands');
    f1.add(data, 'refresh').name("Refresh");
    f1.open();

    var f2 = gui.addFolder('Parameters');

    f2.add(data, 'bridge_pos', -120, 120).name("position").step(1);
    f2.add(data, 'ph1', 1.0, 10.0).name("ph1").step(0.5);
    f2.add(data, 'ph2', 1.0, 15.0).name("ph2").step(0.5);
    f2.add(data, 'ph3', 10.0, 30.0).name("ph3").step(0.5);
    f2.add(data, 's1', .5, 4).name("s1").step(.25);
    f2.add(data, 'n_towers', 2, 4).name("towers").step(1);

    f1.open();
    f2.open();

    gui.close();
}