/*********************************************************************
 *           DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE             *
 *                   Version 2, December 2004                        *
 *                                                                   *
 *  Copyleft meh.                                                    *
 *                                                                   *
 *           DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE             *
 *  TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION  *
 *                                                                   *
 *  0. You just DO WHAT THE FUCK YOU WANT TO.                        *
 *********************************************************************/

miniLOL.module.create("IHM", {
    version: "0.2",

    type: "passive",

    initialize: function () {
        this.IHM = miniLOL.utils.execute(this.root+"/system/IHM.min.js");
        this.ihm = new this.IHM(this.root);

        this.execute();
    },

    execute: function () {
        this.ihm.apply();
    }
});
