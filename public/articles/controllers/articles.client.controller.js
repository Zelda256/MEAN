'use strict';

angular.module('articles').controller('ArticlesController', 
  ['$scope', '$routeParams', '$location', 'Authentication', 'Articles', 
    function ($scope, $routeParams, $location, Authentication, Articles){
      $scope.authentication = Authentication;

      $scope.create = function(){
        const article = new Articles({
          title: this.title,
          content: this.content,
        });
        article.$save((response) => {
          $location.path('articles/' + response._id);
        }, (errorResponse) => {
          $scope.error = errorResponse.data.message;
        });
      };

      $scope.find = () => {
        $scope.articles = Articles.query();
      };

      $scope.findOne = () => {
        $scope.article = Articles.get({
          articleId: $routeParams.articleId
        });
      };

      $scope.update = () => {
        $scope.article.$update(() => {
          $location.path('article/' + $scope.article._id);
        }, (errorResponse) => {
          $scope.error = errorResponse.data.message;
        });
      };

      $scope.delete = (article) => {
        if (article) {
          article.$remove(() => {
            for (let i in $scope.articles) {
              if ($scope.articles[i] === article) {
                $scope.articles.splice(i, 1);
              }
            }
          });
        } else {
          $scope.article.$remove(() => {
            $location.path('articles');
          });
        }
      };
    }
  ]
);
