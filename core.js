/**
 * Created by Valeryia_Kruchak on 17-Nov-14.
 */
(function(){
    var myApp = angular.module('labApp',[]);
    console.log("created");

    myApp.controller('labCtrl',['$scope', 'labProvider', '$http', function($scope, labProvider, $http){
        $scope.climates = [];
        $scope.answers = [];
        $scope.found = [];
        $scope.new = {};
        labProvider.getClimate().then(function(data) {
            $scope.climates = data;
        });

        $scope.sendAnswers = function() {
            $scope.found = [];
            $scope.climates.forEach(function (val, ind, a) {
                    $scope.found.push(val.name);
                    for (var key in val){
                        if( key === '_id' || key === 'name') continue;
                        if(val.min > $scope.answers.temp || val.max < $scope.answers.temp ) {
                            $scope.found.pop();
                            break;
                        }
                        if ( $scope.answers[key] === undefined) continue;
                        if(val[key] !== $scope.answers[key]) {
                            $scope.found.pop();
                            break;
                        }
                    }
                }
            );
            if ($scope.found.length === 0)  $scope.found.push('Nothing found');

        };


        $scope.viewAll = function(){
            $('.all').toggle();
        };

        $scope.more = function(){
            $('.new').toggle();
        };

         $('#checkboxes label').click(function(){
            var ch = $(this).children().prop('checked');
            $(this).toggleClass('active', ch);
        });

        $('#radio label').click(function(){
            $('#radio label').each(function(ind, el){
                $(el).removeClass('active');
            })
            $(this).addClass('active');
        });


        $scope.addNew = function(){
            $scope.new.snow = $scope.answers.snow || false;
            $scope.new.smog = $scope.answers.smog || false;
            $scope.new.rain = $scope.answers.rain || false;
            $scope.new.sun = $scope.answers.sun || false;
            $scope.new.humid = $scope.answers.humid || false;
            $scope.new.location = $scope.answers.location;
            $http.post('/api/rules', $scope.new)
                .success(function (data){
                    $scope.new = {}; // clear the form so our user is ready to enter another
                    $scope.answers = [];
                    $scope.climates = data;
                })
        }

        $scope.delete = function(id){
            $http.delete('/api/rules/' + id)
                .success(function(data){
                    $scope.climates = data;
                    console.log('deleted');
                })

        }
    }]);

    myApp.provider('labProvider',function() {
        return{
            $get: function ($http, $q) {
                var deferred = $q.defer();
                return {
                    getClimate: function () {
                        $http.get('/api/rules')
                            .success(function (data) {
                                deferred.resolve(data)
                            })
                            .error(function(){
                                deferred.reject("Error")
                            })
                        return deferred.promise;
                    }
                }
            }
        }
    });
})();
