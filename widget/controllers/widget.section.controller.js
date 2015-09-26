(function (angular, window) {
    angular
        .module('placesWidget')
        .controller('WidgetSectionCtrl', ['$scope', '$window', 'AppConfig', 'Messaging', 'Buildfire', 'COLLECTIONS', 'EVENTS', '$timeout', 'DB', '$routeParams','PlaceInfo', function ($scope, $window, AppConfig, Messaging, Buildfire, COLLECTIONS, EVENTS, $timeout, DB, $routeParams,PlaceInfo) {
            var WidgetSection = this;
            WidgetSection.placeInfo=PlaceInfo;
            console.log('Section Controller called');
            var Sections = new DB(COLLECTIONS.Sections),
                Items = new DB(COLLECTIONS.Items);

            WidgetSection.section = $routeParams.sectionId;
            WidgetSection.isBusy = false;
            /* tells if data is being fetched*/
            WidgetSection.items = [];
            var _skip = 0,
                _limit = 5,
                _maxLimit = 19,
                searchOptions = {
                    filter: {'$and': [{"$json.itemTitle": {"$regex": '/*'}}, {"$json.sections": {"$all": [WidgetSection.section]}}]},
                    skip: _skip,
                    limit: _limit + 1 // the plus one is to check if there are any more
                };
            /**
             * ContentItems.noMore tells if all data has been loaded
             */
            WidgetSection.noMore = false;

            /**
             * ContentItems.getMore is used to load the items
             */
            WidgetSection.getMore = function () {
                if (WidgetSection.isBusy && WidgetSection.noMore) {
                    return;
                }
                //updateSearchOptions();
                WidgetSection.isBusy = true;
                Items.find(searchOptions).then(function success(result) {
                    if (result.length <= _limit) {// to indicate there are more
                        WidgetSection.noMore = true;
                    }
                    else {
                        WidgetSection.isBusy = false;
                        result.pop();
                        searchOptions.skip = searchOptions.skip + _limit;
                        WidgetSection.noMore = false;
                    }
                    WidgetSection.items = WidgetSection.items ? WidgetSection.items.concat(result) : result;
                }, function fail() {
                    WidgetSection.isBusy = false;
                });
            };
        }]);
})(window.angular, window);