'use strict';

angular.module('articles').factory('Articles', ['$resource', ($resource) => {
  return $resource('/api/articles/:articleId', {
    articleId: '@_id'
  }, {
    update: {
      method: 'PUT'
    }
  });
}]);