angular.module('CookieService', []).factory('cookie', function cookieFactory() {
    return {

        // expires in 10 years
        set: function(key, value) {
            document.cookie = key + '=' + value + '; expires=Thu, 25 Dec 2025 12:00:00 UTC';
        },

        read: function(key) {
            var keyEQ = key + "=";
            var cookies = document.cookie.split(';');
            var currKey;
            var currVal;
            var keyVal;

            for (var i = 0; i < cookies.length; i++) {
                keyVal = cookies[i].trim().split('=');
                currKey = keyVal[0];
                currVal = keyVal[1];
                if (key == currKey)
                return currVal;
            }

            return null;
        },

        delete: function(key) {
            document.cookie = key + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
        },

        all: function(key) {
            return document.cookie;
        }

    }
});
