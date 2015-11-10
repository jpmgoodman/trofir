angular.module('ChatMessageDirective', []).directive('chatMsg', function() {
    return {
        restrict: 'E',
        scope: { message: '=' },
        template: '<div class="message clearfix" data-id="{{ message._id }}">\
        <div class="message-avatar">\
            <img src="{{ message.user_id.avatar_url }}">\
        </div>\
        <div class="message-content">\
            <div class="message-header">\
                <div class="username">{{ message.user_id.username }}</div>\
                <div class="time">{{ message.created_at | date:\'h:mm a\' }}</div>\
            </div>\
            <div class="message-text">\
                {{ message.content }}\
            </div>\
        </div>\
        </div>',
        controller: function($scope) {
            // console.log($scope.message);
        }
    };
});



// angular.module('ChatMessageDirective', []).directive('chatMsg', function() {
//     return {
//         restrict: 'E',
//         scope: { message: '=' },
//         template: '<div class="message clearfix" data-id="{{ message._id }}">\
//         <div class="message-avatar">\
//             <img src="{{ message.user_id.avatar_url }}">\
//         </div>\
//         <div class="message-content">\
//             <div class="message-header">\
//                 <div class="username">{{ message.user_id.username }}</div>\
//                 <div class="time">{{ message.created_at | date:\'h:mm a\' }}</div>\
//             </div>\
//             <div class="message-text">\
//                 {{ message.content }}\
//             </div>\
//         </div>\
//         <div class="upvote" ng-init="isLiked = (myLikes.indexOf(message._id) > -1); preLiked = isLiked;">\
//             <i class="fa fa-heart" ng-class="{\'selected\': isLiked}" ng-click="likeMessage(message._id, isLiked); isLiked = !isLiked;"></i>\
//             <div class="score pre-liked" ng-if="preLiked">\
//                 {{ isLiked ? message.score : message.score - 1 }}\
//             </div>\
//             <div class="score" ng-if="!preLiked">\
//                 {{ isLiked ? message.score + 1 : message.score }}\
//             </div>\
//         </div>\
//         </div>',
//         controller: function($scope) {
//             // console.log($scope.message);
//         }
//     };
// });
