const { default: mongoose } = require("mongoose");

const randomOrgId = () => {
    return Math.floor(Math.random() * 1000);
}

const appSettingsSchema = new mongoose.Schema({
    orgid: {
        type: Number,
        default: randomOrgId
    },
    previewSudbomain: {
        type: String,
        default: 'preview.domain.com'
    },
    liveSubdomain: {
        type: String,
        default: 'jobs.domain.com'
    },
    domainUrl: {
        type: String,
        default: 'domain.com'
    },
    templateEngine: {
        type: Object,
        default: {
            name: 'Nunjucks',
            docs: 'https://mozilla.github.io/nunjucks/',
            disableHelpers: []
        }
    }

})


const appSettingsModel = mongoose.model('appsettings', appSettingsSchema);

module.exports = {
    appSettingsModel
}
