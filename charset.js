angular.module('app').directive('charSet', function(getShortUrl, logger) {
	return {
  		require: ['charSet', 'ngModel'],
		scope: {
			company: '=company',
			firstname: '=btnFirstname',
			lastname: '=btnLastname',
			link: '=btnLink',
			shortlink: '=btnShortlink',
			lms: '=lms',
			maxFirstname: '=maxFirstname',
			maxLastname: '=maxLastname',
			id: '=uniqueId',
			result: '=ngModel'
		},
		controller: ['$scope', function CharSetCtrl($scope) {
			$scope.optout = $scope.company ? ' Txt STOP to OptOut' : '';
			$scope.minLms = 140 - $scope.optout.length - ($scope.company ? $scope.company.length - 2 : 0);
			$scope.max = ($scope.lms ? 500 : 140) - $scope.optout.length - ($scope.company ? $scope.company.length - 2 : 0);
			$scope.firstnameTag = '[$FirstName]';
			$scope.lastnameTag = '[$LastName]';
			$scope.linkTag = '[$Link]';
			$scope.size = 0;
			$scope.showMessageTextUrl = false;
			$scope.shortLinkMessageText = '';

			$scope.toggleUrl = function() {
				$scope.showMessageTextUrl = ! $scope.showMessageTextUrl;
			};

			$scope.insertShortLink = function(longLink) {
				getShortUrl.getLink(longLink, function(shortUrl) {
					if (shortUrl) {
						shortUrl = shortUrl.replace('http://', '');
						$scope.insert(shortUrl);
						$scope.shortLinkMessageText = '';
						document.getElementById('refresh').click();
					} else {
						logger.logError('Inccorect link');
					}
				});
			};

			$scope.charCount = function () {
				$scope.size = 0;
				if ($scope.result && $scope.result != '' && $scope.company && $scope.company != '') {
					$scope.size = $scope.result.length + $scope.company.length + 2;
					if ($scope.result.indexOf($scope.firstnameTag) + 1) {
						$scope.size += $scope.maxFirstname - $scope.firstnameTag.length;
					}

					if ($scope.result.indexOf($scope.lastnameTag) + 1) {
						$scope.size += $scope.maxLastname - $scope.lastnameTag.length;
					}

					if ($scope.result.indexOf($scope.linkTag) + 1) {
						$scope.size += 14 - $scope.linkTag.length;
					}
				}
			};

			$scope.$watch('result', function (newValue, oldValue) {
				$scope.charCount();
			});

			$scope.insert = function (tag) {
				var pos = $scope.caretPosition();
				var before = $scope.result.substr(0, pos);
				var after = $scope.result.substr(pos);
				if (before != '' && before.charAt(before.length - 1) != ' ') {
					tag = ' ' + tag;
				}

				if (after != '' && after.charAt(0) != ' ') {
					tag = tag + ' ';
				}
				$scope.result = before + tag + after;
			};

			$scope.caretPosition = function () {
				$scope.area = $('#' + $scope.id);
				return $scope.area.prop("selectionStart");
			};
		}],
		templateUrl: '/charset.html'
	};
});