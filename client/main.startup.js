window.data = {};

//start script
Meteor.startup(function(){

	//get data
	var get = [
		facebook.getFriends,
		facebook.getFriendRelations,
		facebook.getLikes
	];

	//prepare data for visualisation
	var prepare = [
		graph.compareFriends,
		graph.compareLikes,
		graph.makeForce,
		graph.makeCommunities,
		cache.saveCache
	];

	//start visualisation
	start = DDD.init;

	//check if cached to prevent facebook call
	get = cache.check(get);

	//connect to facebook
	facebook.retrieve(get, prepare, start);
	facebook.connect();

});