/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Main view module.
 *
 * @module views/main
 * @requires {@link core/event}
 * @requires {@link helpers/vibration}
 * @requires {@link models/heartRate}
 * @namespace views/main
 * @memberof views/main
 */

define({
    name: 'views/main',
    requires: [
        'core/event',
        'helpers/vibration',
        'models/heartRate'
    ],
    def: function viewsPageMain(req) {
        'use strict';

        /**
         * Core event module object.
         *
         * @memberof views/main
         * @private
         * @type {any[]}
         */

        var event = req.core.event,

        /**
             * Model heartRate module object.
             *
             * @memberof views/main
             * @private
             * @type {Module}
             */
            heartRate = req.models.heartRate,

            /**
             * Time for measuring heart rate.
             *
             * @memberof views/main
             * @private
             * @const {number}
             */
            //INFO_SETTIMEOUT_DELAY = 10000,

            /**
             * Time for showing information in case,
             * when heart rate is not perceptible by device.
             *
             * @memberof views/main
             * @private
             * @type {number}
             */
            //INFO_SHOW_DELAY = 10000,


        /**
             * Label displaying the value of heart rate.
             *
             * @memberof views/main
             * @private
             * @type {HTMLElement}
             */
            heartRateEl = null,

            /**
             * Current heart rate.
             *
             * @memberof views/main
             * @private
             * @type {number}
             */
            currentRate = 0,

            text = null,

            /**
             * Reference to the main page element.
             *
             * @memberof views/main
             * @private
             * @type {HTMLElement}
             */
            page = null,

            rateArray = [],
            /**
             * Start button element.
             *
             * @type {HTMLElement}
             */
            startBtn = null;

        /**
         * Handles 'models.heartRate.change' event.
         *
         * @memberof views/main
         * @private
         * @param {object} heartRateInfo
         */
        function onHeartRateDataChange(heartRateInfo) {
            var rate = heartRateInfo.detail.rate,
                activePage = document.getElementsByClassName('ui-page-active')[0],
                activePageId = activePage ? activePage.id : '';

            if (rate < 1) {
                rate = 0;
                currentRate = 0;
            }
            currentRate = rate;
        }


        /**
         * Handles click event on start button.
         *
         * @memberof views/main
         * @private
         */
        function onStartBtnClick() {
            var number = parseInt(document.getElementById('interval').value);

            setInterval(function(){
            	heartRateEl.innerHTML = currentRate;
            	rateArray.push(currentRate);
            },number*1000);
            startBtn.innerHTML = "STOP";
            heartRate.start();

            // Redirect to exit when pressed again
            startBtn.addEventListener('click',downloadAndClose);

        }

        function downloadAndClose() {
            download();
            // window.tizen.application.getCurrentApplication().exit();
        }

        function download() {
            var rateToString = rateArray.join(',');
            text = JSON.stringify(rateToString);
            createFile(text);
            exitApp();
        }

        function createFile(text){
            var newFile;
            tizen.filesystem.resolve('documents/newDir10', function(dir) {
                //newFile = dir.createFile('newFile' + Date.now().toString() + '.txt');
                newFile = dir.createFile('newFile' + Math.random() + '.txt');
                newFile.openStream(
                    "rw",
                    function(fs) {
                        fs.write(text);
                        fs.close();
                    }, function(e) {
                        console.log("Error " + e.message);
                    }, "UTF-8");

            }, function (e) {
                console.log(e.message);
            }
        );
        }
       /**
         * Handles exit.
         *
         * @memberof views/main
         * @private
         */
        function exitApp() {
            window.tizen.application.getCurrentApplication().exit();
        }

        /**
         * Registers event listeners.
         *
         * @memberof views/main
         * @private
         */
        function bindEvents() {
            page = document.getElementById('main');
            heartRateEl = document.getElementById('heart-rate-value');

            startBtn = document.getElementById('btn-start');
            startBtn.addEventListener('click', onStartBtnClick);



            event.on({
                'models.heartRate.change': onHeartRateDataChange,
            });

        }

        /**
         * Initializes module.
         *
         * @memberof views/main
         * @public
         */
        function init() {
            bindEvents();
        }

        return {
            init: init
        };
    }

});
