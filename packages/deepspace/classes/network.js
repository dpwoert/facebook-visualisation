DS.classes.Network = function(){

    var population = [];
    var relations = [];

    //add helper for queries
    DS.tools.NetworkQuery.call(this, population, relations);

    this.addPerson = function(information){

        //add UID
        information._UID = DS.tools.UID();

        //save person
        population.push(information);

        //chainable
        return this;

    };

    this.addPersons = function(list){

        //meteor collection
        if(list instanceof Meteor.Collection){
            //todo?
        }

        //just an array
        else {

            for(var i = 0 ; i < list.length ; i++){
                this.addPerson(list[i]);
            }

        }

        //chainable
        return this;

    };

    this.removePerson = function(where, is){
        var person = this.findPerson(where, is);
        //todo
    };

    this.addRelation = function(person1, person2){

        //get inner connectivity
        var connection = this.connectivity(person1, person2, population);

        //add to relations list
        relations.push({
            'source': person1,
            'target': person2,
            'connection': connection
        });

    }

    this.addRelations = function(list, find){

        //add al from list
        for( var i = 0 ; i < list.length ; i++){
            var person1 = this.findPerson(find, list[i].uid1);
            var person2 = this.findPerson(find, list[i].uid2);
            this.addRelation(person1,person2);
        }

        return this;

    }

    this.deleteRelation = function(person1, person2){

        for( var i = 0 ; i < relations.length ; i++ ){

            //search bi-directional
            var rel = relations[i];
            if(
                (rel.source == person1 && rel.target == person2) ||
                (rel.source == person2 && rel.target == person1)
            ){
                relations.splice(i,1);
                return true; //stop search
            }

        }

        return false;

    }

    this.addMessage = function(relation, time, data){

        //check
        if(time instanceof DS.classes.Time === false){
            console.error('not an instance of time');
        }

        //create when needed
        relation.messages = relation.messages || [];
        data = data || {};

        //add
        relation.messages.push({
            'time': time,
            'data': data
        });

    }

    this.connectivity = function(person1, person2, data){
        //standard - must be extended by provider
        return 10;
    };

    this.identify = function(fn){

        for( var i = 0 ; i < population.length ; i ++){
            population[i] = fn(population[i], relations);
        }

        //chainable
        return this;
    };

    this.identifyGroup = function(fn){

        population = fn(population, relations);

        //chainable
        return this;
    };

    //todo remove
    var relate = function(){

        //add all relations
        for( var i = 0 ; i < population.length ; i++ ){

            var rel = population[i].relations;
            if(rel == undefined) rel = [];

            for( var j = 0 ; j < rel.length ; j++ ){

                //find person
                var target;
                for ( var k = 0 ; k < population.length ; k++ ){
                    if(population[k].id == rel[j]){
                        target = k;
                    }
                }

                //todo check if double?

                var connection = this.connectivity(population[i], population[target], population);

                relations.push({
                    'source': i,
                    'target': target,
                    'connection': connection
                });

            }

        }

    };

    this.makeForce = function(){

        //create network
        //relate.call(this);

        console.log('related');

        // Create a force layout to display nodes.
        // this.force = d3.layout.force()
        //     .charge(-300)
        //     .linkDistance(100)
        //     //.size(10,10)
        //     .nodes(population)
        //     .links(relations)

        // this.force.start();

        //chainable
        // return this;

    };

    this.geo = function(){
        //todo
    }

    this.recalculate = function(){
        //todo?
    }

    //publish
    this.population = population;
    this.relations = relations;

};
