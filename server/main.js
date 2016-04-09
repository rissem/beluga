import { Meteor } from 'meteor/meteor';
import Docker from 'dockerode';

var docker = new Docker({socketPath: '/var/run/docker.sock'});

docker.listImages(Meteor.bindEnvironment(function(err, images){
  images.forEach(function(image){
    image._id = image.Id;
    delete(image.Id);
    var imgObj = docker.getImage(image._id);
    imgObj.inspect(Meteor.bindEnvironment(function(err, result){
      Images.upsert({_id: image._id}, {$set: {inspection: result}});
    } ));
    imgObj.history(Meteor.bindEnvironment(function(err, result){
      Images.upsert({_id: image._id}, {$set: {history: result}});
    } ));
  });
}));

Meteor.publish("images", function(){
  return Images.find({});
});

Meteor.startup(() => {
  // code to run on server at startup
});
