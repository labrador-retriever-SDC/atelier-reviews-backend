"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacteristicsReview = exports.Characteristic = exports.Photo = exports.Review = exports.db = void 0;
var sequelize_1 = require("sequelize");
var dotenv_1 = __importDefault(require("dotenv"));
var node_fs_1 = __importDefault(require("node:fs"));
var node_path_1 = __importDefault(require("node:path"));
dotenv_1.default.config();
var dbName = process.env.DB_NAME || '';
var dbUser = process.env.DB_USER || '';
var dbPass = process.env.DB_PASS || '';
var dbHost = process.env.DB_HOST || '';
// Create a database connection
// we can also pass in a connection uri, for example,
// const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbName')
var db = new sequelize_1.Sequelize(dbName, dbUser, dbPass, {
    host: dbHost,
    dialect: 'postgres',
    logging: false
});
exports.db = db;
var testConnection = function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, db.authenticate()];
            case 1:
                _a.sent();
                console.log('Connection has been established successfully.');
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error('Unable to connect to the database:', error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
testConnection();
// Schemas
var Review = db.define('reviews', {
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    product_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    rating: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    date: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        get: function () {
            var dateInMS = this.getDataValue('date');
            return new Date(Number(dateInMS));
        },
    },
    summary: sequelize_1.DataTypes.STRING,
    body: {
        type: sequelize_1.DataTypes.STRING(1000),
        allowNull: false,
        validate: { len: [50, 1000] }
    },
    recommend: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false },
    reported: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false },
    reviewer_name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    reviewer_email: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    response: {
        type: sequelize_1.DataTypes.STRING,
        get: function () {
            var value = this.getDataValue('response');
            return value === 'null' ? null : value;
        }
    },
    helpfulness: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 0 },
}, {
    timestamps: false,
    indexes: [{ unique: false, fields: ['product_id'] }]
});
exports.Review = Review;
var Photo = db.define('photos', {
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    review_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: { model: Review, key: 'id' }
    },
    url: { type: sequelize_1.DataTypes.STRING, allowNull: false }
}, {
    timestamps: false,
    // indexes: [{ unique: false, fields: ['review_id'] }]
});
exports.Photo = Photo;
var Characteristic = db.define('characteristics', {
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    product_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false }
}, {
    timestamps: false,
    indexes: [{ unique: false, fields: ['product_id'] }]
});
exports.Characteristic = Characteristic;
var CharacteristicsReview = db.define('characteristics_reviews', {
    id: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    char_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: Characteristic, key: 'id' }
    },
    review_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: Review, key: 'id' }
    },
    value: { type: sequelize_1.DataTypes.DECIMAL(5, 4), allowNull: false }
}, {
    timestamps: false,
    indexes: [{ unique: false, fields: ['char_id'] }]
});
exports.CharacteristicsReview = CharacteristicsReview;
// Reviews -> Photos: One-to-Many
Review.hasMany(Photo, { foreignKey: 'review_id' });
Photo.belongsTo(Review, { foreignKey: 'review_id' });
// This creates the `review_id` foreign key in Photos.
// Characteristic -> CharacteristicsReview: One-to-Many
// Characteristic.hasMany(CharacteristicsReview, { foreignKey: 'char_id' });
// CharacteristicsReview.belongsTo(Characteristic, { foreignKey: 'char_id' });
/**
 * Seeding data by executing seed.sql
 */
db.sync()
    .then(function () { return Review.count(); })
    .then(function (count) {
    // seed data only if Reviews is empty
    if (count === 0) {
        console.log('Loading data...', new Date());
        var sqlString = node_fs_1.default.readFileSync(node_path_1.default.join(__dirname, '/seed.sql'), 'utf8');
        return db.query(sqlString);
    }
    return undefined;
})
    .then(function () {
    // sync tables with the latest id
    var tables = ['reviews', 'photos', 'characteristics', 'characteristics_reviews'];
    tables.forEach(function (table) {
        return db.query("\n      select setval('".concat(table, "_id_seq', (select max(id) from ").concat(table, "), true);\n      "));
    });
})
    .catch(function (err) { return console.log("Error seeding data", err); })
    .finally(function () { return console.log("Done seeding data.", new Date()); });
