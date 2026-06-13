import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";

declare global {
  interface Window { L: any }
}
import {
  Map as MapIcon, MessageCircle, Route as RouteIcon, User, Info,
  Fuel, BedDouble, TriangleAlert, MapPin, Locate, Plus, X, Trash2,
  Thermometer, Wind, Mountain, Globe, Send, Check, Save, Search,
  PlusCircle, Siren, Phone, Share2, Copy, Heart, ArrowRight, Github,
} from "lucide-react";

/* ════════════════════════════════════════════════════════════════════
   RIDE BUDS — INTERACTIVE DEMO
   Pixel-faithful demo of the production PWA (Next.js + Supabase +
   Google Maps) with the backend stripped: all state lives in memory,
   the map runs on Leaflet + OpenStreetMap (zero API keys), and the
   crew is fictional, seeded deterministically relative to today.
   ════════════════════════════════════════════════════════════════════ */

/* ── Real route data (from the production data/ files) ─────────────── */
const ROUTE_FLAT = [77.209,28.6139,77.2318,28.6261,77.2713,28.6307,77.2681,28.6499,77.2553,28.6651,77.2539,28.6887,77.2612,28.741,77.2814,28.7687,77.2738,28.8154,77.2499,28.8758,77.2226,28.8922,77.1717,28.9166,77.1022,28.9152,76.9689,29.3902,76.9729,29.5385,76.983,29.6195,76.9774,29.6283,76.9905,29.6676,77.0043,29.6777,77.0059,29.706,76.9825,29.7178,76.8998,29.9409,76.8545,30.2189,76.8525,30.2777,76.8341,30.3361,76.8016,30.358,76.7782,30.4289,76.8041,30.5075,76.847,30.5882,76.8246,30.6202,76.8206,30.6586,76.7896,30.7038,76.8008,30.711,76.7794,30.7335,76.791,30.7405,76.8311,30.7083,76.8736,30.7073,76.904,30.747,76.9241,30.8245,76.9455,30.8407,76.9885,30.8365,77.0024,30.8533,76.994,30.8772,77.003,30.875,76.9973,30.891,77.0064,30.8865,77.0046,30.8995,77.0674,30.8896,77.1011,30.8687,77.084,30.8892,77.0915,30.8915,77.0893,30.9059,77.0982,30.9115,77.0881,30.9155,77.1332,30.9358,77.1204,30.9556,77.1103,30.9575,77.1053,30.9689,77.1121,30.9798,77.0918,30.9911,77.0915,31.0,77.0881,31.0033,77.0912,31.0065,77.0909,31.0083,77.097,31.0074,77.1004,31.0097,77.1021,31.0145,77.0991,31.0167,77.1017,31.0197,77.1008,31.0209,77.1076,31.0258,77.1032,31.0307,77.1094,31.034,77.1156,31.0323,77.1196,31.0337,77.1214,31.0365,77.121,31.0398,77.1251,31.04,77.1362,31.0528,77.1335,31.0574,77.1314,31.0579,77.1331,31.0646,77.1321,31.0654,77.1338,31.0668,77.1305,31.0704,77.1385,31.0737,77.1397,31.0785,77.1381,31.0831,77.1408,31.0882,77.137,31.0904,77.1379,31.0919,77.1365,31.0934,77.1394,31.0941,77.1383,31.0972,77.142,31.0984,77.1414,31.1002,77.1433,31.1021,77.151,31.1009,77.1533,31.1028,77.1607,31.1029,77.1656,31.1063,77.1657,31.1096,77.1756,31.1058,77.1799,31.1081,77.1796,31.1117,77.1783,31.1064,77.1725,31.1051,77.1771,31.1054,77.1786,31.109,77.1787,31.1076,77.1828,31.1082,77.1858,31.105,77.1886,31.1072,77.1911,31.1041,77.2004,31.1029,77.2197,31.1116,77.2286,31.1188,77.2365,31.1195,77.2441,31.1154,77.2484,31.1151,77.249,31.1111,77.252,31.1113,77.2518,31.1082,77.2569,31.1069,77.2586,31.104,77.2683,31.0998,77.2694,31.0976,77.275,31.0971,77.2784,31.0987,77.2804,31.0945,77.2849,31.0936,77.288,31.0882,77.3009,31.086,77.3088,31.0911,77.3141,31.0975,77.3166,31.1024,77.3156,31.1083,77.3178,31.1113,77.3202,31.1132,77.3242,31.1135,77.3328,31.1194,77.3363,31.1191,77.3377,31.1249,77.3406,31.1275,77.3463,31.1272,77.3505,31.1299,77.3514,31.1273,77.3606,31.1183,77.3713,31.1169,77.3751,31.1181,77.377,31.1201,77.3764,31.1217,77.3842,31.1258,77.385,31.1292,77.3829,31.1321,77.3864,31.1359,77.3846,31.1384,77.3871,31.1395,77.3859,31.1454,77.3792,31.1564,77.3752,31.1716,77.3769,31.1738,77.376,31.1748,77.3808,31.1753,77.3824,31.1784,77.3814,31.1799,77.3832,31.1871,77.3799,31.1899,77.3795,31.1924,77.3829,31.1943,77.3878,31.1941,77.391,31.1975,77.3926,31.2029,77.3956,31.2046,77.3973,31.2079,77.4055,31.2108,77.4085,31.2158,77.4124,31.2187,77.4145,31.2172,77.4142,31.2136,77.4166,31.2087,77.4188,31.2082,77.4214,31.2022,77.4254,31.2075,77.429,31.2087,77.4282,31.2111,77.436,31.2217,77.4271,31.2332,77.4287,31.2353,77.4267,31.24,77.4293,31.2418,77.4316,31.2404,77.4327,31.2432,77.4359,31.2381,77.4377,31.2385,77.4394,31.2425,77.4429,31.2442,77.4446,31.2427,77.4452,31.2462,77.4477,31.2463,77.4502,31.2491,77.4497,31.252,77.4589,31.256,77.4609,31.2551,77.4584,31.2601,77.4529,31.2639,77.4572,31.265,77.4551,31.2734,77.458,31.2753,77.4539,31.2765,77.4501,31.2799,77.45,31.2827,77.445,31.2859,77.4445,31.3021,77.4476,31.305,77.4404,31.3162,77.4431,31.3157,77.4414,31.3187,77.4446,31.3171,77.4482,31.3175,77.4484,31.3156,77.4528,31.3135,77.4527,31.311,77.4538,31.3136,77.4534,31.3112,77.4577,31.3076,77.4548,31.3022,77.459,31.3034,77.4597,31.3015,77.4632,31.3005,77.4645,31.2969,77.463,31.295,77.4658,31.2964,77.4696,31.2956,77.4669,31.2975,77.4658,31.3048,77.4676,31.307,77.4661,31.3076,77.4664,31.3128,77.4635,31.3176,77.4681,31.3187,77.4652,31.3199,77.4665,31.3242,77.463,31.3244,77.4625,31.3284,77.4591,31.3304,77.4592,31.3322,77.4629,31.3315,77.4612,31.333,77.4556,31.3343,77.4575,31.3358,77.4533,31.3343,77.4563,31.3382,77.4589,31.3369,77.4572,31.3398,77.4549,31.3397,77.4573,31.3407,77.4589,31.339,77.4605,31.3406,77.4591,31.3399,77.4566,31.3433,77.4612,31.3418,77.4604,31.3456,77.4636,31.3491,77.4787,31.349,77.4829,31.3533,77.4929,31.3518,77.4984,31.353,77.5058,31.3472,77.5241,31.3495,77.5444,31.3717,77.5469,31.3757,77.5468,31.3795,77.5507,31.3849,77.5537,31.3852,77.5527,31.3872,77.5544,31.3888,77.564,31.3869,77.5731,31.3873,77.5767,31.3881,77.58,31.3933,77.5999,31.3942,77.6191,31.3872,77.6246,31.387,77.6289,31.3887,77.6324,31.3925,77.6353,31.4006,77.623,31.4141,77.6215,31.4193,77.6226,31.4341,77.628,31.4456,77.6269,31.4511,77.6311,31.4521,77.6311,31.451,77.6311,31.4521,77.6266,31.4508,77.6282,31.443,77.6301,31.4495,77.639,31.4544,77.6521,31.4532,77.659,31.4581,77.6728,31.4603,77.679,31.4722,77.6836,31.4762,77.6862,31.476,77.6832,31.4801,77.6875,31.485,77.695,31.4837,77.6932,31.4874,77.7004,31.492,77.7044,31.4914,77.7076,31.496,77.7094,31.4952,77.7105,31.4987,77.7142,31.5021,77.7214,31.5022,77.7243,31.5015,77.7246,31.4996,77.7302,31.5059,77.7358,31.5074,77.7391,31.505,77.7427,31.5103,77.7444,31.5103,77.7527,31.5183,77.7576,31.5149,77.7558,31.5194,77.7587,31.5219,77.7665,31.5205,77.773,31.5236,77.7738,31.5265,77.781,31.5261,77.7805,31.5295,77.7823,31.5315,77.7806,31.5349,77.7832,31.5353,77.7831,31.5405,77.7851,31.5423,77.792,31.5417,77.8016,31.5429,77.8036,31.5444,77.8092,31.5414,77.8147,31.5426,77.8191,31.5481,77.8209,31.5472,77.8211,31.5488,77.8242,31.5501,77.8267,31.5597,77.826,31.5624,77.8291,31.5663,77.8351,31.5677,77.8391,31.564,77.8411,31.5643,77.8512,31.5693,77.8524,31.5712,77.8517,31.574,77.8536,31.5741,77.8769,31.5602,77.8819,31.5546,77.8831,31.5577,77.8813,31.561,77.8826,31.5626,77.8877,31.5672,77.8931,31.5671,77.8974,31.5655,77.9022,31.5603,77.9129,31.5555,77.913,31.5523,77.9144,31.5519,77.9163,31.5545,77.9256,31.5578,77.9301,31.5662,77.9381,31.565,77.9464,31.5672,77.9509,31.5616,77.959,31.5602,77.9673,31.564,77.9874,31.5623,77.9951,31.5584,78.0034,31.548,78.0095,31.5444,78.0109,31.5454,78.0035,31.5506,77.9983,31.5596,78.005,31.5504,78.0122,31.5466,78.0151,31.5469,78.0123,31.5469,78.0049,31.5526,78.0142,31.5483,78.0083,31.5516,78.0172,31.5491,78.0201,31.5503,78.0199,31.5526,78.024,31.5555,78.0296,31.5564,78.0374,31.567,78.044,31.5714,78.0408,31.5801,78.0393,31.5761,78.0381,31.5763,78.0393,31.5761,78.0408,31.5801,78.044,31.5714,78.0374,31.567,78.0296,31.5564,78.024,31.5555,78.0199,31.5526,78.0201,31.5503,78.0172,31.5491,78.0083,31.5516,78.0142,31.5483,78.0049,31.5526,78.0123,31.5469,78.0151,31.5469,78.0122,31.5466,78.005,31.5504,77.9983,31.5596,78.0035,31.5506,78.0109,31.5454,78.0095,31.5444,78.0153,31.5376,78.0306,31.5426,78.0357,31.541,78.0416,31.5357,78.0463,31.5338,78.0495,31.5284,78.0542,31.5252,78.0724,31.5215,78.0859,31.5224,78.0981,31.5164,78.1056,31.5174,78.1147,31.5139,78.1236,31.5143,78.1366,31.521,78.1423,31.5214,78.17,31.5106,78.1774,31.5009,78.1847,31.4971,78.1964,31.4972,78.2065,31.4994,78.2104,31.4968,78.2205,31.4965,78.2363,31.5069,78.2431,31.5084,78.2519,31.5141,78.2683,31.5163,78.2718,31.5183,78.2765,31.5223,78.2824,31.5328,78.279,31.5412,78.278,31.5512,78.2804,31.5557,78.2783,31.5587,78.2792,31.5547,78.2776,31.5531,78.2785,31.5553,78.2766,31.5581,78.2774,31.555,78.2759,31.5535,78.2762,31.5567,78.2753,31.5524,78.2724,31.5493,78.2719,31.542,78.2753,31.5379,78.258,31.515,78.304,31.525,78.342,31.6024,78.39,31.635,78.428,31.6815,78.51,31.725,78.575,31.7703,78.568,31.785,78.6,31.82,78.62,31.85,78.6333,31.8833,78.61,31.92,78.59,31.96,78.61,32.01,78.57,32.05,78.5,32.07,78.43,32.085,78.3835,32.0931,78.32,32.11,78.26,32.13,78.2,32.16,78.15,32.19,78.11,32.21,78.071,32.2279];
const STAGES = [{"name":"Delhi \u2192 Chandigarh","km":260,"to_lat":30.7333,"to_lng":76.7794},{"name":"Chandigarh \u2192 Shimla","km":120,"to_lat":31.1048,"to_lng":77.1734},{"name":"Shimla \u2192 Narkanda","km":65,"to_lat":31.2626,"to_lng":77.4615},{"name":"Narkanda \u2192 Rampur","km":65,"to_lat":31.4525,"to_lng":77.628},{"name":"Rampur \u2192 Reckong Peo","km":100,"to_lat":31.5383,"to_lng":78.277},{"name":"Reckong Peo \u2192 Nako","km":100,"to_lat":31.8833,"to_lng":78.6333},{"name":"Nako \u2192 Tabo","km":65,"to_lat":32.0931,"to_lng":78.3835},{"name":"Tabo \u2192 Kaza","km":50,"to_lat":32.2279,"to_lng":78.071}];
const VERIFIED_FUEL = [{"name":"HP Petrol Pump, Rampur Bushahr","brand":"HP","lat":31.4525,"lng":77.628,"verified":false,"last_verified":null,"notes":"Last reliable pump before Reckong Peo on the lower road"},{"name":"IOCL Reckong Peo","brand":"IOC","lat":31.5383,"lng":78.277,"verified":false,"last_verified":null,"notes":"Main pump in district HQ. Often busy late afternoon."},{"name":"HP Petrol Pump, Pooh","brand":"HP","lat":31.7703,"lng":78.575,"verified":false,"last_verified":null,"notes":"Crucial top-up before Kaza. Limited hours."},{"name":"IOCL Kaza","brand":"IOC","lat":32.2279,"lng":78.071,"verified":false,"last_verified":null,"notes":"Highest retail outlet in the world. Cash preferred."},{"name":"BPCL Solan","brand":"BPCL","lat":30.9045,"lng":77.0967,"verified":false,"last_verified":null,"notes":""},{"name":"HP Petrol Pump, Shimla bypass","brand":"HP","lat":31.1048,"lng":77.1734,"verified":false,"last_verified":null,"notes":""},{"name":"IOCL Narkanda","brand":"IOC","lat":31.2626,"lng":77.4615,"verified":false,"last_verified":null,"notes":""},{"name":"HP Petrol Pump, Karcham","brand":"HP","lat":31.5048,"lng":78.1699,"verified":false,"last_verified":null,"notes":"Junction for Sangla valley."}];
const DANGER_ZONES = [{"name":"Pooh \u2192 Kaza fuel gap","from_lat":31.7703,"from_lng":78.575,"to_lat":32.2279,"to_lng":78.071,"approx_km":130,"warning":"No reliable fuel between Pooh and Kaza. Top up at Pooh and carry minimum 5 litres additional fuel."}];
const FUEL_POIS = [{"id":"bBbdqA6o","name":"IndianOil","lat":30.8984,"lng":77.0112,"rating":4.1},{"id":"P_Cs5Aso","name":"IndianOil","lat":30.8383,"lng":76.9887,"rating":4.1},{"id":"b4wJdnlI","name":"Ramesh Service Station Petrol Pump","lat":30.9025,"lng":77.0177,"rating":4},{"id":"6pze4r54","name":"IndianOil","lat":30.899,"lng":77.0052,"rating":4.2},{"id":"2mLoktKk","name":"SURYA FILLING STATION","lat":30.903,"lng":77.0048,"rating":4.8},{"id":"6gd5aCks","name":"Valley View Filling Station","lat":30.8903,"lng":76.9991,"rating":4.1},{"id":"WKbkfVhM","name":"IndianOil","lat":31.0761,"lng":77.1823,"rating":4.4},{"id":"JzZY41TI","name":"Hindustan Petroleum Corporation Limited","lat":31.1151,"lng":77.102,"rating":4},{"id":"arBMe0a0","name":"IndianOil","lat":31.0864,"lng":77.1947,"rating":4.1},{"id":"tzTnCnfI","name":"Hindustan Petroleum Corporation Limited","lat":31.1604,"lng":77.2014,"rating":4.1},{"id":"efgdE78A","name":"SHILON FILLING STATION","lat":31.0509,"lng":77.2614,"rating":4.4},{"id":"c7_E_uc4","name":"IndianOil","lat":31.1831,"lng":77.1681,"rating":4.7},{"id":"jeYNmXXw","name":"IndianOil","lat":31.2571,"lng":77.4597,"rating":4.2},{"id":"A-IBUkJ8","name":"IndianOil","lat":31.3184,"lng":77.4458,"rating":4.3},{"id":"63CxJwto","name":"Nayara Energy - Cr Filling Station, Shillaru","lat":31.2134,"lng":77.4305,"rating":4.4},{"id":"fEDIGREo","name":"IndianOil","lat":31.3498,"lng":77.4797,"rating":4},{"id":"SzVqI_uY","name":"BITHAL FILLING STATION","lat":31.3521,"lng":77.4931,"rating":4.6},{"id":"e77rzg_c","name":"IndianOil","lat":31.2051,"lng":77.3959,"rating":4.4},{"id":"oEb6VWUc","name":"Hindustan Petroleum Corporation Limited","lat":31.2371,"lng":77.428,"rating":4.2},{"id":"JyF63cGk","name":"IndianOil","lat":31.1971,"lng":77.5272,"rating":4.9},{"id":"LjZc43b8","name":"IndianOil","lat":31.2404,"lng":77.5634,"rating":4.4},{"id":"hs8EEC54","name":"JDD Kalta Filling Station","lat":31.1647,"lng":77.5084,"rating":4},{"id":"MeX__Gtw","name":"Bharat Petroleum, Petrol Pump -H.S.Khaneri Filling Station","lat":31.4578,"lng":77.6595,"rating":4.2},{"id":"DeqKKuXM","name":"Hindustan Petroleum Corporation Limited","lat":31.3929,"lng":77.5885,"rating":4.4},{"id":"Bm0mVMzI","name":"Jio-bp","lat":31.3947,"lng":77.5959,"rating":4.5},{"id":"NvAVNLUo","name":"Hindustan Petroleum Corporation Limited","lat":31.4545,"lng":77.6403,"rating":4},{"id":"E8kr8Q3o","name":"Hindustan Petroleum Corporation Limited","lat":31.3879,"lng":77.5575,"rating":4.1},{"id":"SrZbnO1U","name":"IndianOil","lat":31.3878,"lng":77.5696,"rating":4.1},{"id":"PyF_Q_SM","name":"Hindustan Petroleum Corporation Limited","lat":31.4107,"lng":77.5832,"rating":4.6},{"id":"AIBqmPz8","name":"Hriday Energies, Bharat Petroleum Corporation Limited Petrol pump","lat":31.4163,"lng":77.5804,"rating":4.8},{"id":"hhmZWCbg","name":"Hindustan Petroleum Corporation Limited","lat":31.5199,"lng":78.0923,"rating":4.1},{"id":"s31MCUgM","name":"Army Petrol Pump","lat":31.5164,"lng":78.1533,"rating":4},{"id":"iFhYhW90","name":"Hindustan Petroleum Corporation Limited","lat":31.5377,"lng":78.2804,"rating":4},{"id":"Nope4bSs","name":"Silk Route Filling Station","lat":31.5334,"lng":78.2741,"rating":4.9},{"id":"bNaCXJWc","name":"Snow Valley fuel point,Recong peo","lat":31.5265,"lng":78.2702,"rating":4.9},{"id":"Y84XtUvA","name":"Nayara Fuel Pump","lat":31.5264,"lng":78.2703,"rating":5},{"id":"9mHW3KVM","name":"IndianOil","lat":31.7593,"lng":78.5944,"rating":4.2},{"id":"iJ7Zd-8Y","name":"IndianOil","lat":32.2277,"lng":78.0699,"rating":4.2}];
const LODGING_POIS = [{"id":"1pVdFolI","name":"Kasauli Hills Resort - Best Luxury Resort and Hotel","lat":30.9201,"lng":76.9825,"rating":4.4},{"id":"39i3g49Y","name":"Timber Trail Resort","lat":30.8358,"lng":76.9819,"rating":4.3},{"id":"tOC9ddb4","name":"Glenview Resort Kasauli, a member of Radisson Individuals","lat":30.8793,"lng":76.9811,"rating":4.4},{"id":"z4o2pgYk","name":"Fortune Select Forest Hill, Mahiya, Kasauli - Member ITC Hotels\u2019 Group","lat":30.84,"lng":77.0594,"rating":4.7},{"id":"kUxqceuM","name":"Ramada by Wyndham Kasauli","lat":30.8988,"lng":76.991,"rating":4.5},{"id":"E0WKhPv0","name":"The Fern Surya Resort Dharampur, Kasauli Hills, Series by Marriott","lat":30.888,"lng":77.0028,"rating":4.2},{"id":"JpBKpB9I","name":"Moksha Himalaya Spa Resort Himachal Pradesh - Parwanoo","lat":30.8195,"lng":76.9903,"rating":4.3},{"id":"QbbCC8Cs","name":"Jungle Lodge Resorts","lat":30.9039,"lng":77.0323,"rating":4.4},{"id":"7-rDsqco","name":"Winnies Holiday Resort & Spa Kasauli","lat":30.8964,"lng":76.996,"rating":4.4},{"id":"Lx84lcBU","name":"The Belvedere Kasauli","lat":30.8472,"lng":76.9818,"rating":4.3},{"id":"2J3mKP0Y","name":"Baikunth Resorts, Kasauli","lat":30.9239,"lng":76.9751,"rating":4.4},{"id":"a_t140gw","name":"Savoy Greens, Jabli","lat":30.8778,"lng":76.994,"rating":4.4},{"id":"Bn4qa_Sc","name":"Lemon Tree Hotel, Kasauli","lat":30.9046,"lng":76.992,"rating":4.5},{"id":"_RXs1VOc","name":"Rosetum Kasauli","lat":30.9054,"lng":76.9814,"rating":4.4},{"id":"Gcsd8wYg","name":"WelcomHeritage Santa Roza, Kasauli","lat":30.9387,"lng":76.9797,"rating":4.6},{"id":"mzWvU94Y","name":"Kasauli Mist Luxury Ac Rooms in Kasauli HOTEL/VILLA","lat":30.9006,"lng":77.0069,"rating":4.6},{"id":"4NOWFUbk","name":"Anantam Kasauli","lat":30.8978,"lng":77.0084,"rating":4.9},{"id":"m_9cS2fU","name":"Kasauli Exotica","lat":30.9019,"lng":76.9689,"rating":4.1},{"id":"3Vo6hSc4","name":"Club Mahindra Resort - Pristine Peaks Naldehra, Shimla, Himachal Pradesh","lat":31.1738,"lng":77.2035,"rating":4.5},{"id":"h8yQ6ukM","name":"Wildflower Hall, An Oberoi Resort, Shimla","lat":31.1137,"lng":77.2478,"rating":4.4},{"id":"jHSvV4WU","name":"Snow Valley Resorts Shimla","lat":31.0937,"lng":77.1389,"rating":4.3},{"id":"XHKktJKw","name":"The Oberoi Cecil, Shimla","lat":31.1032,"lng":77.155,"rating":4.5},{"id":"_qFOZzlE","name":"8fold by LaRiSa, Shimla","lat":31.0926,"lng":77.1369,"rating":4.6},{"id":"XgsQpalc","name":"The Hosteller Shimla","lat":31.1032,"lng":77.179,"rating":4.6},{"id":"Wxlo3R4g","name":"Sterling Kufri","lat":31.0906,"lng":77.2863,"rating":4.3},{"id":"Y1Kqy9JM","name":"Club Mahindra Resort - Shimla, Himachal Pradesh","lat":31.1292,"lng":77.228,"rating":4.1},{"id":"fUmkJu4o","name":"Radisson Hotel Jass Shimla","lat":31.1116,"lng":77.1772,"rating":4.2},{"id":"ATTnD3YM","name":"Welcomhotel By ITC Hotels, Shimla - Premium Hotel in the Mashobra Valley | Surrounded by Lush Flora | Stunning Mountain Views","lat":31.1381,"lng":77.2146,"rating":4.8},{"id":"bvs8PQ8E","name":"Marigold Sarovar Portico","lat":31.1605,"lng":77.204,"rating":4.3},{"id":"egK6QqFs","name":"The Orchid Hotel Shimla","lat":31.0991,"lng":77.2024,"rating":4.5},{"id":"7S7tDvVY","name":"Hotel Marina Shimla","lat":31.0973,"lng":77.1771,"rating":4.2},{"id":"woDARHSs","name":"Radisson Hotel Kufri Shimla","lat":31.1011,"lng":77.2659,"rating":4.8},{"id":"TvObmhhw","name":"Hotel Woodville Palace Shimla ( A Heritage property since 1938 )","lat":31.0916,"lng":77.1779,"rating":4.4},{"id":"fduBWOks","name":"Hotel Willow Banks- Boutique 4 star Hotel on the Mall Road Shimla","lat":31.1009,"lng":77.1764,"rating":4.1},{"id":"VzRsjgTw","name":"Koti Resort Shimla, a member of Radisson Individuals Retreats","lat":31.1608,"lng":77.2059,"rating":4.5},{"id":"2nJ_phW8","name":"Hotel Combermere","lat":31.1022,"lng":77.1772,"rating":4},{"id":"7E46FASM","name":"Hotel Landmark","lat":31.1055,"lng":77.1636,"rating":4},{"id":"ZVdJqxtE","name":"Snow Valley Heights","lat":31.0944,"lng":77.1348,"rating":4.6},{"id":"xre1B2iQ","name":"The Hosteller Narkanda","lat":31.2571,"lng":77.4582,"rating":4.8},{"id":"iZglUDnA","name":"Zostel Kotgarh (Narkanda)","lat":31.3065,"lng":77.4817,"rating":4.6},{"id":"yGkg3WT4","name":"Echor Backwoods Villa Narkanda","lat":31.2692,"lng":77.4584,"rating":4.6},{"id":"VUjIxR1c","name":"Khadu Cafe","lat":31.2162,"lng":77.4096,"rating":4.6},{"id":"lNCDCe40","name":"Banjara Orchard Retreat at Thanedar","lat":31.3163,"lng":77.4923,"rating":4.5},{"id":"i1TOItek","name":"Greenberry Hotel and Resorts","lat":31.2546,"lng":77.4606,"rating":4.5},{"id":"TY31uhgM","name":"Himachal Tourism HPTDC Hotel Hatu","lat":31.2529,"lng":77.4624,"rating":4.2},{"id":"Z4pKAcjc","name":"Treebo The Northern Retreat Resort With Mountain View","lat":31.3194,"lng":77.4926,"rating":4.3},{"id":"PBmS1DZU","name":"Tethys Ski Resort","lat":31.2453,"lng":77.4683,"rating":4.4},{"id":"kNPoqgjY","name":"MeenaBagh Homes & Farms Ratnari","lat":31.2296,"lng":77.5382,"rating":4.5},{"id":"vnxopNXo","name":"Crossroads Narkanda Cottages","lat":31.2123,"lng":77.4064,"rating":4.6},{"id":"rFenLi4o","name":"Hotel Snowflake","lat":31.2551,"lng":77.4582,"rating":4.1},{"id":"Jzsbuvmk","name":"PIYUSH RESIDENCY","lat":31.2558,"lng":77.4594,"rating":4.4},{"id":"kwsUrqoc","name":"The Morel House","lat":31.3124,"lng":77.4376,"rating":4.7},{"id":"IOSa1gXE","name":"Gadegal Homestay Narkanda | Rooms and Pahadi Cafe","lat":31.2086,"lng":77.4184,"rating":4.9},{"id":"X-FkZGM8","name":"Hawk Eye Resort","lat":31.2464,"lng":77.5816,"rating":4.9},{"id":"qRKK7tNc","name":"Nesta Narkanda Moonwake Cottages","lat":31.2411,"lng":77.4765,"rating":4.3},{"id":"xe7IuLcQ","name":"Agyaat Vaas","lat":31.2448,"lng":77.5086,"rating":4.3},{"id":"eG92rDlc","name":"The Halt @Narkanda | Rooms & Rooftop Cafe","lat":31.3187,"lng":77.441,"rating":4.8},{"id":"DGDck3rw","name":"Hotel Nau Nabh Heritage, Padam Palace . Rampur Bushahr","lat":31.4503,"lng":77.6311,"rating":4.3},{"id":"zanUI0lE","name":"Hotel KC REGENCY","lat":31.4541,"lng":77.654,"rating":4},{"id":"Pg5mUP18","name":"Hotel Bushehar Regency Rampur","lat":31.4382,"lng":77.627,"rating":4.1},{"id":"1oOC2ueI","name":"The Mahesh Regency","lat":31.3943,"lng":77.5906,"rating":4.1},{"id":"NAmNXQ3w","name":"HOTEL VIRASAT -E-BUSHAHR","lat":31.4405,"lng":77.6284,"rating":4.5},{"id":"ZDCd4qSk","name":"Hotel The Grand Shangri-la Rampur","lat":31.4225,"lng":77.6231,"rating":4},{"id":"AU6NeV-M","name":"Crimson inn b&b home stay","lat":31.4225,"lng":77.623,"rating":4.7},{"id":"c-cxQHuE","name":"HOTEL RIVER VIEW","lat":31.385,"lng":77.5531,"rating":4.6},{"id":"6jPp-Jn8","name":"Hotel Bhagwati, Bar & Restaurant","lat":31.4507,"lng":77.6296,"rating":4.5},{"id":"ZrFJNLzM","name":"Rest House HP PWD, Rampur","lat":31.439,"lng":77.6271,"rating":4.2},{"id":"GklJnm94","name":"Onz_northzone_expedition","lat":31.442,"lng":77.6284,"rating":4.3},{"id":"c9I7h2hI","name":"SJVN GUEST HOUSE","lat":31.4934,"lng":77.7055,"rating":4.6},{"id":"IMW_VAZ8","name":"Monal Bhavan SJVN Guest House","lat":31.4884,"lng":77.7025,"rating":4.7},{"id":"n1G8KQ2U","name":"Satluj River View Food & Home Stay","lat":31.3759,"lng":77.5468,"rating":4.8},{"id":"z3wtTvhc","name":"Circuit House, Rampur Bushahr","lat":31.4399,"lng":77.6273,"rating":4.6},{"id":"oqPBcDZs","name":"Forest Rest House","lat":31.3984,"lng":77.6382,"rating":4},{"id":"DdnWIVPY","name":"UTTSAV","lat":31.4239,"lng":77.6225,"rating":4.5},{"id":"hRsYoRZg","name":"SATKAAR Homestay & camping service","lat":31.5483,"lng":78.139,"rating":4.6},{"id":"aMkIpF-k","name":"YULLA PALSARA HOME STAY with Camping&Trekking Guide Services","lat":31.5523,"lng":78.1388,"rating":4.7},{"id":"wvSsl8V4","name":"Yulla kanda Kin camps and cafe","lat":31.5849,"lng":78.145,"rating":5},{"id":"SCB-jixw","name":"Hotel pagramang restaurant and bar","lat":31.517,"lng":78.0964,"rating":4},{"id":"ZkPpu4pw","name":"Lake View Resort, kafnoo","lat":31.6173,"lng":78.0234,"rating":4.2},{"id":"-yTlaAQE","name":"Pin Bhaba Pass Trek","lat":31.5928,"lng":78.0383,"rating":4.9},{"id":"Vflt1kmc","name":"Gudiya homestay yulla khas","lat":31.5495,"lng":78.1362,"rating":4.8},{"id":"1dgR0sO0","name":"JITAS HOME STAY","lat":31.5169,"lng":78.0975,"rating":4.3},{"id":"nKtgC6wQ","name":"Bhaba Pin Home Stay","lat":31.6298,"lng":78.0192,"rating":5},{"id":"IfcOzbk8","name":"Pin Bhaba Retreat Homestay","lat":31.5611,"lng":77.9568,"rating":4.4},{"id":"-pDOtURU","name":"Rampur","lat":31.5625,"lng":77.9833,"rating":4},{"id":"7GN8xuuM","name":"Safarnama Homestay \ud83c\udfe1 & Camping Service","lat":31.5492,"lng":78.1366,"rating":5},{"id":"ztZHlKDI","name":"Anand Homestay & camping service Yulla\ud83c\udfe1 \u0906\u0928\u0902\u0926 \u0939\u094b\u092e\u0938\u094d\u091f\u0947 & \u0915\u0948\u0902\u092a\u093f\u0902\u0917 \u0938\u0930\u094d\u0935\u093f\u0938","lat":31.549,"lng":78.1364,"rating":5},{"id":"LJZF0Bs8","name":"Yullakanda cafe & camping sarvice","lat":31.5779,"lng":78.1439,"rating":4.9},{"id":"fiULRUlc","name":"Yoncharas Home Stay","lat":31.5631,"lng":77.9278,"rating":4},{"id":"8JIqS_6Q","name":"Shuwal Homstay & camping services","lat":31.5508,"lng":78.1389,"rating":4.9},{"id":"qP0JFOpA","name":"Krishna homestay yulla","lat":31.5477,"lng":78.1368,"rating":4.9},{"id":"sXwWYwXE","name":"Jeevan Jyoti Home Stay","lat":31.6166,"lng":78.0233,"rating":5},{"id":"CTjxAPx8","name":"Zostel Kalpa (Kinnaur)","lat":31.5309,"lng":78.248,"rating":4.7},{"id":"S_yh3Mps","name":"Fayul Retreat","lat":31.5417,"lng":78.2479,"rating":4.7},{"id":"wllHik3I","name":"Echor The Alpine Crest Kalpa","lat":31.5351,"lng":78.2494,"rating":4.3},{"id":"GzsnBpss","name":"HPTDC Hotel The Kinner Kailash","lat":31.5335,"lng":78.2486,"rating":4.4},{"id":"jXzQ_i-c","name":"Grand Shamba-La Kalpa","lat":31.5356,"lng":78.2502,"rating":4.2},{"id":"Et1G98lU","name":"Hotel Rollingrang, Kalpa.","lat":31.5332,"lng":78.248,"rating":4.7},{"id":"NQP_G7_g","name":"Hotel White Nest Kalpa HP","lat":31.535,"lng":78.2496,"rating":4.5},{"id":"-D7fQ9hM","name":"Hotel Kalpa Mansion","lat":31.5484,"lng":78.2557,"rating":4.4},{"id":"fqanhEz8","name":"Hotel Kalpa Deshang","lat":31.5302,"lng":78.2509,"rating":4.4},{"id":"40r9tAqc","name":"Hotel Sheetal Kalpa","lat":31.5392,"lng":78.2525,"rating":4.2},{"id":"kJTUC9j8","name":"Wanderers Homestay - All mountain facing rooms","lat":31.5331,"lng":78.2701,"rating":4.9},{"id":"NrF52Iog","name":"HOTEL NIRVANA","lat":31.5399,"lng":78.2673,"rating":4.1},{"id":"P7Q-hlmE","name":"The Alpine Nest","lat":31.5371,"lng":78.2646,"rating":4.1},{"id":"y-TxD4Io","name":"Royal resort kalpa","lat":31.5406,"lng":78.2525,"rating":4.8},{"id":"zdVmKfqI","name":"The White Castle","lat":31.5336,"lng":78.2516,"rating":4.5},{"id":"hQaCi2v8","name":"Hotel Monal Residency Kalpa","lat":31.534,"lng":78.2502,"rating":4.4},{"id":"pHLNTby0","name":"Whistling Pines Homestay ( mountain facing rooms )","lat":31.5339,"lng":78.27,"rating":4.9},{"id":"vi3MukyM","name":"Rudra Homestays","lat":31.533,"lng":78.27,"rating":4.9},{"id":"VrxKpWB0","name":"Exotic _ Tab","lat":31.5482,"lng":78.2559,"rating":4.6},{"id":"ZUnuvw94","name":"Hotel Kalpa Retreat","lat":31.5358,"lng":78.2496,"rating":4.8},{"id":"8LqPFsWk","name":"LAKE VIEW Hotel & Restaurant , Nako","lat":31.8805,"lng":78.6276,"rating":4.5},{"id":"ebWEDDvM","name":"Hotel Nako Regency","lat":31.8822,"lng":78.6277,"rating":4},{"id":"vTezqV-Y","name":"Hotel Reo Purguil","lat":31.8818,"lng":78.6292,"rating":4.1},{"id":"PPrsIDWE","name":"Om Hotel and Restaurant Pooh Kinnaur","lat":31.7603,"lng":78.5839,"rating":4.2},{"id":"WuiqLqLA","name":"Hotel Zambala","lat":31.8803,"lng":78.6287,"rating":4},{"id":"jweqZZdw","name":"Lovon Hotel and Restaurant","lat":31.8821,"lng":78.6292,"rating":4.9},{"id":"DvR4BNd8","name":"Knaygoh Kinner Camps","lat":31.8801,"lng":78.6297,"rating":4.6},{"id":"bfqOShr4","name":"Kharba Villa Nako","lat":31.8806,"lng":78.6279,"rating":4.3},{"id":"ygK_mBEA","name":"Hotel valley view 2.0","lat":31.7576,"lng":78.5855,"rating":4.9},{"id":"VGvOw0pY","name":"Tanghaa House Nako","lat":31.882,"lng":78.6278,"rating":4.9},{"id":"QOyvQWFo","name":"Rikpa Home Stay Nako","lat":31.8807,"lng":78.626,"rating":4.8},{"id":"4kx1eRSI","name":"The Lakeside Nako","lat":31.8803,"lng":78.6286,"rating":5},{"id":"rQ_fOCO0","name":"TASHI HOME STAY","lat":31.8806,"lng":78.6289,"rating":4.5},{"id":"xEmct5M4","name":"Don-me Homestay","lat":31.7632,"lng":78.5951,"rating":4.8},{"id":"y_bMGTiw","name":"HPPWD Rest House, POOH","lat":31.7628,"lng":78.5837,"rating":4.2},{"id":"ZHY1WVEI","name":"Norling Homestay Nako","lat":31.8838,"lng":78.6295,"rating":4.8},{"id":"mqNMKc20","name":"\ud83c\udf3f SONAM HOMESTAY \u2013 \u201cConnected to Wi-Fi, Connected to Culture\u201d","lat":31.8825,"lng":78.6274,"rating":4.8},{"id":"ga_qeTYE","name":"Himalayan Paradise Hotel & Restaurant","lat":31.8808,"lng":78.6292,"rating":4.7},{"id":"I0mRepfc","name":"Deepak Homestay Nako","lat":31.8823,"lng":78.626,"rating":5},{"id":"zuP0_Slk","name":"Hotel Snow White","lat":31.8932,"lng":78.6298,"rating":4.4},{"id":"f9uxfu3c","name":"Echor Mud Huts Tabo, Spiti Valley","lat":32.0918,"lng":78.3824,"rating":4.5},{"id":"98apLw1w","name":"Maitreya Mud House Tabo by Eco Hospitality","lat":32.0939,"lng":78.3831,"rating":4.8},{"id":"T41i8sQ4","name":"Hotel Gangchen","lat":32.0936,"lng":78.3671,"rating":4.7},{"id":"Kjsk5CXc","name":"Green Tara home stay tabo","lat":32.0949,"lng":78.3795,"rating":4.9},{"id":"i5bIJPHY","name":"White Lotus Homes Tabo","lat":32.0943,"lng":78.3784,"rating":4.9},{"id":"0OHNzDpE","name":"Hotel Maitreya Regency Tabo by Eco Hospitality","lat":32.0934,"lng":78.3841,"rating":4.6},{"id":"5s0T0gas","name":"Aema SpitiStay Inn","lat":32.095,"lng":78.3798,"rating":4.9},{"id":"eWhu-WQ0","name":"Zostel Homes Tabo","lat":32.0776,"lng":78.3498,"rating":4.7},{"id":"W2baD9kE","name":"Hotel Lhunpo House","lat":32.0952,"lng":78.382,"rating":4.7},{"id":"MAQIs5I4","name":"Spiti Mud Huts Tabo","lat":32.0922,"lng":78.3821,"rating":4.8},{"id":"2po5Tivo","name":"Hotel Tabo paradise","lat":32.0946,"lng":78.3768,"rating":4.7},{"id":"G76kj_OE","name":"The Norphel Hotel and restaurant","lat":32.0761,"lng":78.3495,"rating":4.7},{"id":"LVCZJ6Hw","name":"Namsay Homestay Tabo","lat":32.095,"lng":78.3791,"rating":4.6},{"id":"bbmq_Xk0","name":"The Spiti Villa Tabo","lat":32.0938,"lng":78.3734,"rating":4.9},{"id":"QcqWeh_U","name":"Palkit home stay Tabo","lat":32.0947,"lng":78.3836,"rating":4.9},{"id":"Z3vh6rxE","name":"Phuntsok Homestay","lat":32.0943,"lng":78.3841,"rating":4.9},{"id":"Y0dBab5w","name":"Yiga Home stay","lat":32.0947,"lng":78.3781,"rating":5},{"id":"ezx3CysQ","name":"Tow Dhey Hotel","lat":32.0954,"lng":78.381,"rating":4.5},{"id":"MHEaVZ5c","name":"Namkha Homestay and Camps","lat":32.0938,"lng":78.3833,"rating":4.2},{"id":"7K0uIMyE","name":"Tenzin brothers homestay","lat":32.0793,"lng":78.4211,"rating":5},{"id":"2Z3epYy4","name":"Zostel Spiti","lat":32.2216,"lng":78.0747,"rating":4.4},{"id":"BrCeFpjg","name":"Hotel Deyzor & Restaurant","lat":32.2273,"lng":78.0685,"rating":4.7},{"id":"QHYBFIag","name":"Kaza Market","lat":32.217,"lng":78.0795,"rating":4.2},{"id":"kuEY6Sdo","name":"Social Courtyard Spiti","lat":32.2465,"lng":78.0293,"rating":4.7},{"id":"bwG6geLc","name":"SPITI VALLEY HOTEL","lat":32.2279,"lng":78.0716,"rating":4.4},{"id":"BkUrF0tI","name":"Hotel Sakya Abode","lat":32.2282,"lng":78.0721,"rating":4.5},{"id":"SWuT9wl0","name":"Hotel Spiti Heritage","lat":32.2242,"lng":78.0676,"rating":4.4},{"id":"kA4Scb8s","name":"THE SPITI HPTDC Hotel","lat":32.2302,"lng":78.066,"rating":4.1},{"id":"981Dq2kI","name":"Yellow Hotels & Cottages Kaza","lat":32.2251,"lng":78.0645,"rating":4.6},{"id":"fwCHit_o","name":"The Eco Domes Spiti","lat":32.2458,"lng":78.0368,"rating":4.7},{"id":"G_Eq1Ct0","name":"Buddha's abode","lat":32.2248,"lng":78.0657,"rating":4.8},{"id":"000cR7Ug","name":"The Heritage Piti Jalsa","lat":32.2221,"lng":78.0746,"rating":4.8},{"id":"Mo4npvX0","name":"Mahamaya Regency by Eco Hospitality","lat":32.2246,"lng":78.0696,"rating":4.7},{"id":"XSfsBrr8","name":"The Kaza Inn","lat":32.227,"lng":78.0731,"rating":4.9},{"id":"SBDzAunU","name":"Blue Mountain Hotel & Cafe","lat":32.2297,"lng":78.0678,"rating":4.7},{"id":"XxbCtENI","name":"Hotel Himalayan Hermitage kaza","lat":32.2247,"lng":78.071,"rating":4.7},{"id":"bsb5ws68","name":"Dhue Gu Yangkhil Hotel (HIM SHELTER)","lat":32.2251,"lng":78.0668,"rating":4.8},{"id":"DCFmf8cQ","name":"Hotel Old Monk","lat":32.2263,"lng":78.0712,"rating":4.6},{"id":"TWrg6gno","name":"Jigme Home Stay","lat":32.226,"lng":78.0673,"rating":4.9},{"id":"wziKP_1I","name":"Spiti Sarai & Resort","lat":32.2459,"lng":78.033,"rating":4.3},{"id":"8avw0Dfw","name":"Hotel Spiti Villa Himalayan Brothers","lat":32.2882,"lng":78.0141,"rating":4.7},{"id":"GMmgJy7o","name":"Spiti Village Resort","lat":32.2876,"lng":78.013,"rating":4.1},{"id":"ZPn0TDYw","name":"AMIDA","lat":32.2608,"lng":78.0173,"rating":4.8}];
function routePath() {
  const out = [];
  for (let i = 0; i < ROUTE_FLAT.length; i += 2) out.push([ROUTE_FLAT[i + 1], ROUTE_FLAT[i]]);
  return out; // [lat, lng]
}

/* Curated side trips — same five as production MapShell. */
const SIDE_TRIP_POIS = [
  { id: "kunnu",   label: "Ancient Monastery, Kunnu", lat: 31.5839, lng: 78.3668 },
  { id: "rangrik", label: "Rangrik Temple",           lat: 31.3537, lng: 78.6138 },
  { id: "kanam",   label: "Kanam Village",            lat: 31.6765, lng: 78.4513 },
  { id: "labrang", label: "Labrang Fort",             lat: 31.6775, lng: 78.4417 },
  { id: "lipa",    label: "Lipa–Asarang",             lat: 31.6588, lng: 78.3829 },
];

/* ── Marker icons — straight port of src/lib/map/icons.ts ──────────── */
const INK = "#1B2A4A", CREAM = "#FAF3E1", ORANGE = "#E8602A", TEAL = "#2E8A8A",
      BROWN = "#8B5A2B", WARNING = "#D4471F", SIDE_ORANGE = "#E07B2A";

function pinSvg({ fill, stroke = INK, inner }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="40" height="48" viewBox="0 0 40 48">
  <ellipse cx="20" cy="46" rx="7" ry="1.5" fill="rgba(0,0,0,0.18)"/>
  <path d="M20 2 C9 2 3 11 4 20 C5 28 13 36 20 46 C27 36 35 28 36 20 C37 11 31 2 20 2 Z" fill="${fill}" stroke="${stroke}" stroke-width="2.5" stroke-linejoin="round"/>
  <g transform="translate(11 9)">${inner}</g>
</svg>`;
}
const dataUri = (svg) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

const beaconInner = `<circle cx="9" cy="9" r="5" fill="${CREAM}" stroke="${INK}" stroke-width="1.5"/><circle cx="9" cy="9" r="2" fill="${INK}"/>`;
const fuelInner = `<rect x="2" y="2" width="9" height="14" rx="1" fill="${CREAM}" stroke="${INK}" stroke-width="1.5"/><rect x="4" y="4" width="5" height="3.5" fill="${INK}"/><path d="M11 6 L14 6 L14 12 A1.5 1.5 0 0 1 12.5 13.5" fill="none" stroke="${CREAM}" stroke-width="1.5"/>`;
const hotelInner = `<path d="M2 14 L2 6 L9 3 L16 6 L16 14" fill="${CREAM}" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round"/><rect x="7" y="9" width="4" height="5" fill="${INK}"/>`;
const hazardInner = `<path d="M9 1 L17 16 L1 16 Z" fill="${CREAM}" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round"/><rect x="8.2" y="6" width="1.6" height="5.5" fill="${INK}"/><circle cx="9" cy="13.5" r="0.9" fill="${INK}"/>`;
const sideTripInner = `<path d="M9 2 L10.6 6.8 L15.6 6.8 L11.6 9.8 L13.1 14.5 L9 11.6 L4.9 14.5 L6.4 9.8 L2.4 6.8 L7.4 6.8 Z" fill="${CREAM}" stroke="${INK}" stroke-width="1.2" stroke-linejoin="round"/>`;
const verifiedFuelInner = `<rect x="2" y="2" width="9" height="14" rx="1" fill="${CREAM}" stroke="${INK}" stroke-width="1.5"/><rect x="4" y="4" width="5" height="3.5" fill="${INK}"/><path d="M11 6 L14 6 L14 12 A1.5 1.5 0 0 1 12.5 13.5" fill="none" stroke="${CREAM}" stroke-width="1.5"/><circle cx="14.5" cy="3.5" r="3" fill="${TEAL}" stroke="${INK}" stroke-width="1.2"/><path d="M13 3.6 L14.2 4.7 L16 2.7" fill="none" stroke="${CREAM}" stroke-width="1.3" stroke-linecap="round"/>`;

const MARKER_ICONS = {
  beacon: dataUri(pinSvg({ fill: ORANGE, inner: beaconInner })),
  fuel: dataUri(pinSvg({ fill: CREAM, inner: fuelInner })),
  fuelVerified: dataUri(pinSvg({ fill: TEAL, inner: verifiedFuelInner })),
  hotel: dataUri(pinSvg({ fill: BROWN, inner: hotelInner })),
  hazard: dataUri(pinSvg({ fill: WARNING, inner: hazardInner })),
  sideTrip: dataUri(pinSvg({ fill: SIDE_ORANGE, inner: sideTripInner })),
  sideUser: dataUri(pinSvg({ fill: TEAL, inner: sideTripInner })),
};

/* ── Seeded demo crew + pins (deterministic LCG, relative to load) ── */
function makeLcg(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
const daySeed = (() => { const d = new Date(); return d.getFullYear() * 372 + (d.getMonth() + 1) * 31 + d.getDate(); })();
const rnd = makeLcg(daySeed);

const YOU = { id: "you", name: "Arjun Nair", bike: "Himalayan 450", phone: "919876543210",
  avatar: "🦅", is_admin: false, blood: "B+", ice: [{ name: "Lakshmi (spouse)", phone: "+91 98765 43211" }] };

const CREW = [
  YOU,
  { id: "r2", name: "Dhruv Mehta",   bike: "Interceptor 650", phone: "919876510001", avatar: "🐺", is_admin: true },
  { id: "r3", name: "Meera Pillai",  bike: "KTM 390 Adventure", phone: "919876510002", avatar: "🏔️", is_admin: false },
  { id: "r4", name: "Sandeep Rana",  bike: "Hero XPulse 200",  phone: "919876510003", avatar: "🧭", is_admin: false },
  { id: "r5", name: "Farah Khan",    bike: "Classic 350",      phone: "919876510004", avatar: "🌄", is_admin: false },
  { id: "r6", name: "Tenzin Bodh",   bike: "V-Strom SX",       phone: "919876510005", avatar: "🐉", is_admin: false },
  { id: "r7", name: "Vikram Anand",  bike: "Dominar 400",      phone: null,           avatar: "⛽", is_admin: false },
];

/* Spots along the actual route, Shimla → Kaza, with light jitter. */
const SPOTS = [
  { lat: 31.4525, lng: 77.6280, near: "Rampur" },
  { lat: 31.5383, lng: 78.2770, near: "Reckong Peo" },
  { lat: 31.5360, lng: 77.7950, near: "Karcham" },
  { lat: 31.8833, lng: 78.6333, near: "Nako" },
  { lat: 31.2626, lng: 77.4615, near: "Narkanda" },
  { lat: 32.0931, lng: 78.3835, near: "Tabo" },
];
const jitter = () => (rnd() - 0.5) * 0.012;
const minsAgo = (m) => new Date(Date.now() - m * 60000).toISOString();

function seedPins() {
  const notes = ["Chai + maggi stop ☕", "Topped up, tank full", "Crossed the check post, ILP sorted",
    "Waiting for the crew at the dhaba", "Roads clear till here", null];
  const pins = CREW.slice(1, 7).map((r, i) => {
    const s = SPOTS[i % SPOTS.length];
    return { id: `seed-${i}`, type: "checkin", rider_id: r.id,
      lat: s.lat + jitter(), lng: s.lng + jitter(),
      note: notes[Math.floor(rnd() * notes.length)],
      created_at: minsAgo(Math.round(12 + rnd() * 540)) };
  });
  pins.push({ id: "hz-1", type: "hazard", rider_id: "r3", lat: 31.5505, lng: 77.8660,
    note: "Shooting stones after the Karcham dam — ride through quick, no stopping", created_at: minsAgo(160) });
  pins.push({ id: "hz-2", type: "hazard", rider_id: "r2", lat: 31.6210, lng: 78.5390,
    note: "Water crossing before Pooh, slippery moss. First gear, feet down.", created_at: minsAgo(75) });
  pins.push({ id: "sd-1", type: "side", rider_id: "r5", lat: 31.6050 + jitter(), lng: 78.4400 + jitter(),
    note: "Tiny tea house with apricot cake. Worth the 2 km detour!", created_at: minsAgo(310) });
  return pins.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
}

function seedMessages() {
  return [
    { id: "m1", rider_id: "r2", body: "Crew check — everyone fueled up after Rampur?", created_at: minsAgo(95) },
    { id: "m2", rider_id: "r5", body: "Yes! Found a side spot near Spello, pinned it 🧡", created_at: minsAgo(88) },
    { id: "m3", rider_id: "r3", body: "Heads up, dropped a hazard pin after Karcham. Shooting stones.", created_at: minsAgo(82) },
    { id: "m4", rider_id: "r6", body: "Noted. BSNL signal only past Peo, switching now", created_at: minsAgo(61) },
    { id: "m5", rider_id: "r4", body: "Maggi point at Nako lake, who's joining? 🍜", created_at: minsAgo(24) },
  ];
}

const riderById = (riders, id) => riders.find((r) => r.id === id) || null;

/* ── timeAgo + phone helpers (ports of MapShell + lib/phone.ts) ───── */
function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function formatPhoneForDisplay(d) {
  if (!d) return null;
  if (d.startsWith("91") && d.length === 12) return `+91 ${d.slice(2, 7)} ${d.slice(7)}`;
  return `+${d}`;
}
const whatsappUrl = (digits, msg) => digits ? `https://wa.me/${digits}?text=${encodeURIComponent(msg)}` : null;

/* ── Open-Meteo (real, keyless) with seeded fallback for sandboxes ── */
const WMO = { 0:"Clear",1:"Mainly clear",2:"Partly cloudy",3:"Overcast",45:"Fog",51:"Light drizzle",
  61:"Light rain",63:"Rain",65:"Heavy rain",71:"Light snow",73:"Snow",80:"Rain showers",95:"Thunderstorm" };
const envCache = new Map();
async function fetchEnv(lat, lng) {
  const key = `${lat.toFixed(3)},${lng.toFixed(3)}`;
  if (envCache.has(key)) return envCache.get(key);
  let out;
  try {
    const [w, e] = await Promise.all([
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,wind_speed_10m,weather_code&wind_speed_unit=kmh&timezone=auto`).then(r => r.json()),
      fetch(`https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lng}`).then(r => r.json()),
    ]);
    out = { tempC: Math.round(w.current.temperature_2m), windKph: Math.round(w.current.wind_speed_10m),
      desc: WMO[w.current.weather_code] ?? "—", elevM: Math.round(e.elevation[0]), live: true };
  } catch {
    const g = makeLcg(Math.round(lat * 1000 + lng * 7));
    const elevM = Math.round(900 + (lat - 28.6) * 800 + g() * 300);
    out = { tempC: Math.round(24 - elevM / 280), windKph: Math.round(4 + g() * 18),
      desc: ["Clear", "Partly cloudy", "Mainly clear"][Math.floor(g() * 3)], elevM, live: false };
  }
  envCache.set(key, out);
  return out;
}


/* ── Leaflet loader (cdnjs only — no keys, no env) ─────────────────── */
let leafletPromise: Promise<any> | null = null;
function loadLeaflet() {
  if (leafletPromise) return leafletPromise;
  leafletPromise = new Promise((resolve, reject) => {
    if (window.L && window.L.markerClusterGroup) return resolve(window.L);
    const css = (href) => { const l = document.createElement("link"); l.rel = "stylesheet"; l.href = href; document.head.appendChild(l); };
    css("https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css");
    css("https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/MarkerCluster.min.css");
    const js = (src) => new Promise((res, rej) => {
      const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s);
    });
    js("https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js")
      .then(() => js("https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/leaflet.markercluster.min.js"))
      .then(() => resolve(window.L))
      .catch(reject);
  });
  return leafletPromise;
}

/* ── Itinerary logic — straight port of src/lib/itinerary/pace.ts ──── */
const PACE_PROFILES = [
  { id: "relaxed",  label: "Relaxed",  kmpd: 180, hint: "150–200 km/day. Easy days, time for photos." },
  { id: "standard", label: "Standard", kmpd: 350, hint: "300–400 km/day. Most riders." },
  { id: "fast",     label: "Fast",     kmpd: 500, hint: "500+ km/day. Iron-butt." },
];
const START_CITIES = [
  { name: "Delhi", lat: 28.6139, lng: 77.209 },
  { name: "Chandigarh", lat: 30.7333, lng: 76.7794 },
];
const CHANDIGARH = START_CITIES[1];

function haversineKm(a, b) {
  const R = 6371, toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function planDayStages(stages, startCityName, kmpd) {
  const lower = startCityName.toLowerCase();
  let startIdx = 0;
  for (let i = 0; i < stages.length; i++) {
    if (stages[i].name.toLowerCase().startsWith(lower + " →")) { startIdx = i; break; }
  }
  const remaining = stages.slice(startIdx);
  const days = [];
  let dayFrom = startCityName, acc = 0, dayN = 1;
  for (let i = 0; i < remaining.length; i++) {
    const s = remaining[i];
    const next = acc + s.km;
    const isLast = i === remaining.length - 1;
    if (next >= kmpd || isLast) {
      const toTown = s.name.split("→")[1].trim();
      days.push({ day: dayN, from: dayFrom, to: toTown, km: Math.round(next), to_lat: s.to_lat, to_lng: s.to_lng });
      dayFrom = toTown; acc = 0; dayN++;
    } else acc = next;
  }
  return days;
}

const TOWN_OPTIONS = [
  ...START_CITIES,
  ...STAGES.map((s) => ({ name: s.name.split("→")[1].trim(), lat: s.to_lat, lng: s.to_lng })),
];

/* Offline geocoder — production calls a session-gated Nominatim proxy. */
const DEMO_CITIES = {
  kochi: { name: "Kochi", lat: 9.9312, lng: 76.2673 },
  bengaluru: { name: "Bengaluru", lat: 12.9716, lng: 77.5946 },
  bangalore: { name: "Bengaluru", lat: 12.9716, lng: 77.5946 },
  mumbai: { name: "Mumbai", lat: 19.076, lng: 72.8777 },
  pune: { name: "Pune", lat: 18.5204, lng: 73.8567 },
  jaipur: { name: "Jaipur", lat: 26.9124, lng: 75.7873 },
  ahmedabad: { name: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
  hyderabad: { name: "Hyderabad", lat: 17.385, lng: 78.4867 },
  chennai: { name: "Chennai", lat: 13.0827, lng: 80.2707 },
  kolkata: { name: "Kolkata", lat: 22.5726, lng: 88.3639 },
  goa: { name: "Goa", lat: 15.2993, lng: 74.124 },
  indore: { name: "Indore", lat: 22.7196, lng: 75.8577 },
  lucknow: { name: "Lucknow", lat: 26.8467, lng: 80.9462 },
  dehradun: { name: "Dehradun", lat: 30.3165, lng: 78.0322 },
};

/* ════════════════════════ UI BUILDING BLOCKS ═══════════════════════ */

function DemoBanner() {
  return (
    <div className="above-grain" style={{
      background: "var(--ink)", color: "var(--cream-soft)", fontSize: 11,
      textAlign: "center", padding: "6px 12px", lineHeight: 1.5, position: "relative", zIndex: 50,
    }}>
      <strong>Demo</strong> — fictional crew, sample data, everything in browser memory.
      Production runs on <strong>Next.js · Supabase Realtime · Google Maps</strong>.
    </div>
  );
}

function ChromeBar() {
  return (
    <div style={{
      maxWidth: 448, margin: "16px auto 0", display: "flex", alignItems: "center",
      justifyContent: "center", padding: "10px 16px", background: "var(--cream-soft)",
      border: "2px solid var(--ink)", borderRadius: 8, boxShadow: "2px 2px 0 var(--ink)",
    }} className="above-grain">
      <span className="display" style={{ color: "var(--orange)", fontSize: 24, textShadow: "1.5px 1.5px 0 var(--ink)" }}>
        RIDE BUDS
      </span>
    </div>
  );
}

function Gateway({ onEnter, posterSrc }) {
  return (
    <div style={{ minHeight: "100vh", paddingBottom: 40 }}>
      <ChromeBar />
      <div className="above-grain" style={{ maxWidth: 448, margin: "20px auto 0", padding: "0 16px" }}>
        {/* Tank Up Vol. 9 poster hero — actual /public/tank-up-poster.jpg in the deployed demo. */}
        <div style={{ aspectRatio: "3 / 4", border: "2px solid var(--ink)", boxShadow: "3px 3px 0 var(--ink)", borderRadius: 6, overflow: "hidden", position: "relative", background: "var(--ink)" }}>
          {posterSrc ? (
            <img src={posterSrc} alt="Tank Up Vol. 9 — Hotel Deyzor Kaza, May 2026" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          ) : (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, padding: 24, textAlign: "center" }}>
              <div className="display" style={{ color: "var(--orange)", fontSize: 42, textShadow: "2px 2px 0 rgba(250,243,225,0.25)" }}>TANK UP</div>
              <div className="display" style={{ color: "var(--cream-soft)", fontSize: 26 }}>VOL. 9 · KAZA</div>
              <div className="handwritten" style={{ color: "var(--teal-soft)", fontSize: 22 }}>Hotel Deyzor, Spiti · May 2026</div>
              <div style={{ color: "rgba(250,243,225,0.55)", fontSize: 11, marginTop: 12 }}>
                event poster renders here in the deployed demo
              </div>
            </div>
          )}
        </div>

        {/* Demo gateway — replaces the ride-code + join flow. */}
        <div className="card-paper" style={{ padding: 24, marginTop: 20 }}>
          <label className="field-label">Ride code</label>
          <div className="input-paper" style={{ textAlign: "center", letterSpacing: "0.2em", fontWeight: 600, fontSize: 18, color: "var(--ink-soft)" }}>
            KAZA26
          </div>
          <button className="btn-primary" style={{ width: "100%", marginTop: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }} onClick={onEnter}>
            Enter demo as Arjun <ArrowRight size={16} />
          </button>
          <p style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 14, lineHeight: 1.55 }}>
            <strong>How this works in production:</strong> riders join with a ride code, name and
            optional phone — no accounts, no passwords. The server sets an HttpOnly HMAC-signed
            session cookie, and re-joining with the same phone re-attaches you to your existing
            rider record instead of creating a duplicate. This demo skips all of that with one tap.
          </p>
        </div>

        <p style={{ fontSize: 12, color: "rgba(46,62,98,0.7)", textAlign: "center", marginTop: 20, lineHeight: 1.6 }} className="above-grain">
          Your location is only shared when you tap to check in. <br />
          No accounts. No live tracking.{" "}
          <span className="handwritten" style={{ fontSize: 15, color: "var(--teal)" }}>Meet up or Go Solo.</span>
        </p>
      </div>
    </div>
  );
}

/* ════════════════════════════ MAP TAB ══════════════════════════════ */

/* In production a check-in uses real device GPS. The demo "GPS" is a fixed
   point on the route just past Rampur, with a little wobble. */
const DEMO_GPS = { lat: 31.4849, lng: 77.6995 };

function buildPinPopupEl(pin, rider, { canDelete, onDelete }) {
  const el = document.createElement("div");
  el.style.cssText = "max-width:240px;font-family:inherit;padding:2px;";
  const name = rider ? `${rider.avatar ?? ""} ${rider.name}` : "rider";
  const typeLabel = pin.type === "checkin" ? "checked in" : pin.type === "side" ? "side trip" : pin.type;
  const phonePretty = rider ? formatPhoneForDisplay(rider.phone) : null;
  const firstName = rider ? rider.name.split(" ")[0] : "there";
  const waMsg = `Hi ${firstName}! Got your number from Ride Buds. How's it going out there?`;
  const wa = rider ? whatsappUrl(rider.phone, waMsg) : null;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${pin.lat},${pin.lng}`;

  el.innerHTML = `
    <div style="font-size:14px;font-weight:700;color:#1b2a4a">${name}</div>
    <div style="font-size:11px;color:#2e3e62">${typeLabel} · ${timeAgo(pin.created_at)}${rider && rider.bike ? " · " + rider.bike : ""}</div>
    ${pin.note ? `<div style="font-size:12px;margin-top:6px">${escapeHtml(pin.note)}</div>` : ""}
    <div data-env style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;font-size:11px;color:#2e3e62;min-height:14px">
      <span style="opacity:0.6">loading conditions…</span>
    </div>
    ${phonePretty ? `<div style="font-size:11px;margin-top:6px"><a href="tel:+${rider.phone}" style="color:#1b2a4a;font-weight:600;text-decoration:none">${phonePretty}</a></div>` : ""}
    <div data-actions style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px"></div>`;

  const actions = el.querySelector("[data-actions]");
  const a1 = document.createElement("a");
  a1.href = mapsUrl; a1.target = "_blank"; a1.rel = "noreferrer"; a1.className = "rb-pop-btn";
  a1.style.cssText = "background:#e8602a;color:#faf3e1"; a1.textContent = "Open in Maps";
  actions.appendChild(a1);
  if (wa) {
    const a2 = document.createElement("a");
    a2.href = wa; a2.target = "_blank"; a2.rel = "noreferrer"; a2.className = "rb-pop-btn";
    a2.style.cssText = "background:#2e8a8a;color:#faf3e1"; a2.textContent = "💬 WhatsApp";
    actions.appendChild(a2);
  }
  if (canDelete) {
    const b = document.createElement("button");
    b.className = "rb-pop-btn"; b.style.cssText = "background:#d4471f;color:#faf3e1"; b.textContent = "🗑 delete";
    b.onclick = () => { if (window.confirm("Delete this pin?")) onDelete(pin.id); };
    actions.appendChild(b);
  }

  fetchEnv(pin.lat, pin.lng).then((env) => {
    const slot = el.querySelector("[data-env]");
    if (!slot) return;
    slot.innerHTML = `
      <span>🌡 ${env.tempC}°C · ${env.desc}</span>
      <span>💨 ${env.windKph} km/h</span>
      <span>⛰ ${env.elevM} m${env.elevM >= 3000 ? " · AMS zone" : ""}</span>
      ${env.live ? "" : `<span style="opacity:0.55">(demo conditions)</span>`}`;
  });
  return el;
}

function LayerChip({ active, onClick, icon, children }) {
  return (
    <button className="rb-chip" onClick={onClick} style={{
      background: active ? "var(--ink)" : "var(--cream-soft)",
      color: active ? "var(--cream-soft)" : "var(--ink)",
    }}>
      {icon}{children}
    </button>
  );
}

function PickerTab({ active, onClick, color, children }) {
  return (
    <button role="tab" aria-selected={active} onClick={onClick} style={{
      flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 4,
      padding: "6px 8px", fontSize: 11, fontWeight: 600, borderRadius: 6, fontFamily: "inherit",
      background: active ? color : "var(--cream-soft)",
      color: active ? "var(--cream-soft)" : "var(--ink)",
      border: "1.5px solid var(--ink)", cursor: "pointer",
    }}>{children}</button>
  );
}

function MapTab({ riders, pins, onDropPin, onDeletePin, toast, setToast }) {
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const layersRef = useRef<any>({});
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [tilesBlocked, setTilesBlocked] = useState(false);
  const [layers, setLayers] = useState({ route: true, beacons: true, fuel: false, hotels: false, hazards: false, sideTrips: false });
  const [picker, setPicker] = useState<"checkin" | "hazard" | "side" | null>(null);
  const [pickerNote, setPickerNote] = useState("");
  const [pickerBusy, setPickerBusy] = useState(false);
  const [bannerGone, setBannerGone] = useState(false);
  const dz = DANGER_ZONES[0];

  useEffect(() => {
    if (!dz) return;
    const t = setTimeout(() => setBannerGone(true), 10000);
    return () => clearTimeout(t);
  }, []);

  /* Build the map once Leaflet lands. */
  useEffect(() => {
    let dead = false;
    loadLeaflet().then((L) => {
      if (dead || !mapDivRef.current || mapRef.current) return;
      const map = L.map(mapDivRef.current, { center: [31.5, 77.8], zoom: 7, zoomControl: true, attributionControl: true });
      const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18, attribution: '&copy; OpenStreetMap contributors',
      });
      let errs = 0;
      tiles.on("tileerror", () => { if (++errs > 6) setTilesBlocked(true); });
      tiles.on("tileload", () => setTilesBlocked(false));
      tiles.addTo(map);

      const mk = (iconUrl) => L.icon({ iconUrl, iconSize: [40, 48], iconAnchor: [20, 46], popupAnchor: [0, -44] });
      const icons = {
        beacon: mk(MARKER_ICONS.beacon), hazard: mk(MARKER_ICONS.hazard), side: mk(MARKER_ICONS.sideUser),
        sideCurated: mk(MARKER_ICONS.sideTrip), fuel: mk(MARKER_ICONS.fuel),
        fuelVerified: mk(MARKER_ICONS.fuelVerified), hotel: mk(MARKER_ICONS.hotel),
      };

      const route = L.polyline(routePath(), { color: "#1B2A4A", opacity: 0.9, weight: 4 });

      const clusterOpts = {
        showCoverageOnHover: false, maxClusterRadius: 52,
        iconCreateFunction: (c) => L.divIcon({ html: `<div class="rb-cluster">${c.getChildCount()}</div>`, className: "", iconSize: [40, 40] }),
      };
      const fuelCluster = L.markerClusterGroup(clusterOpts);
      FUEL_POIS.forEach((p) => fuelCluster.addLayer(L.marker([p.lat, p.lng], { icon: icons.fuel, title: p.name })
        .bindPopup(`<div style="font-size:13px;font-weight:700;color:#1b2a4a">${p.name}</div><div style="font-size:11px;color:#2e3e62">fuel${p.rating ? " · ★ " + p.rating : ""}</div>`)));
      const hotelCluster = L.markerClusterGroup(clusterOpts);
      LODGING_POIS.forEach((p) => hotelCluster.addLayer(L.marker([p.lat, p.lng], { icon: icons.hotel, title: p.name })
        .bindPopup(`<div style="font-size:13px;font-weight:700;color:#1b2a4a">${p.name}</div><div style="font-size:11px;color:#2e3e62">stay${p.rating ? " · ★ " + p.rating : ""}</div>`)));

      const verified = L.layerGroup(VERIFIED_FUEL.map((s) => {
        const m = L.marker([s.lat, s.lng], { icon: icons.fuelVerified, title: `${s.brand} — ${s.name}` });
        m.on("click", () => window.open(`https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}`, "_blank"));
        m.bindTooltip(`${s.brand} · verified — tap to navigate`, { direction: "top", offset: [0, -44] });
        return m;
      }));

      const curatedSide = L.layerGroup(SIDE_TRIP_POIS.map((s) => {
        const m = L.marker([s.lat, s.lng], { icon: icons.sideCurated, title: s.label });
        m.bindPopup(`<div style="max-width:200px;padding:2px">
          <div style="font-size:13px;font-weight:700;color:#1b2a4a">${s.label}</div>
          <div style="font-size:11px;color:#E07B2A;margin-top:2px">suggested side trip</div>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}" target="_blank" rel="noreferrer"
             style="display:inline-block;margin-top:8px;font-size:11px;font-weight:600;padding:6px 10px;background:#E07B2A;color:#FAF3E1;border-radius:6px;text-decoration:none">Navigate here</a></div>`);
        return m;
      }));

      layersRef.current = {
        L, map, icons, route, fuelCluster, hotelCluster, verified, curatedSide,
        beacons: L.layerGroup(), hazards: L.layerGroup(), sidePins: L.layerGroup(),
      };
      mapRef.current = map;
      setReady(true);
    }).catch(() => setLoadError(true));
    return () => { dead = true; if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  }, []);

  /* Sync pin markers whenever pins change. */
  useEffect(() => {
    if (!ready) return;
    const { L, icons, beacons, hazards, sidePins } = layersRef.current;
    [beacons, hazards, sidePins].forEach((g) => g.clearLayers());
    pins.forEach((p) => {
      const rider = riderById(riders, p.rider_id);
      const icon = p.type === "checkin" ? icons.beacon : p.type === "hazard" ? icons.hazard : icons.side;
      const group = p.type === "checkin" ? beacons : p.type === "hazard" ? hazards : sidePins;
      const m = L.marker([p.lat, p.lng], { icon });
      m.bindPopup(() => buildPinPopupEl(p, rider, {
        canDelete: p.rider_id === YOU.id || YOU.is_admin,
        onDelete: (id) => { onDeletePin(id); layersRef.current.map.closePopup(); },
      }), { maxWidth: 260 });
      group.addLayer(m);
    });
  }, [ready, pins, riders, onDeletePin]);

  /* Sync layer toggles. */
  useEffect(() => {
    if (!ready) return;
    const r = layersRef.current;
    const pairs = [
      [layers.route, r.route], [layers.beacons, r.beacons], [layers.hazards, r.hazards],
      [layers.fuel, r.fuelCluster], [layers.fuel, r.verified], [layers.hotels, r.hotelCluster],
      [layers.sideTrips, r.curatedSide], [layers.sideTrips, r.sidePins],
    ];
    pairs.forEach(([on, layer]) => {
      if (on && !r.map.hasLayer(layer)) r.map.addLayer(layer);
      if (!on && r.map.hasLayer(layer)) r.map.removeLayer(layer);
    });
  }, [ready, layers]);

  const zoomAllIndia = () => {
    const r = layersRef.current;
    if (r.map) r.map.fitBounds([[6.5, 68.0], [35.5, 97.5]], { padding: [40, 40] });
  };

  async function drop(type) {
    if (pickerBusy) return;
    setPickerBusy(true);
    await new Promise((res) => setTimeout(res, 450)); // simulated GPS fix
    const pin = {
      id: `me-${Date.now()}`, type, rider_id: YOU.id,
      lat: DEMO_GPS.lat + (Math.random() - 0.5) * 0.004,
      lng: DEMO_GPS.lng + (Math.random() - 0.5) * 0.004,
      note: pickerNote.trim() || null, created_at: new Date().toISOString(),
    };
    onDropPin(pin);
    if (type === "side") setLayers((l) => (l.sideTrips ? l : { ...l, sideTrips: true }));
    if (type === "hazard") setLayers((l) => (l.hazards ? l : { ...l, hazards: true }));
    setToast(type === "checkin" ? "checked in" : type === "hazard" ? "hazard logged" : "side trip saved");
    setPicker(null); setPickerNote(""); setPickerBusy(false);
    const r = layersRef.current;
    if (r.map) r.map.flyTo([pin.lat, pin.lng], Math.max(r.map.getZoom(), 11), { duration: 0.8 });
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "calc(100vh - 5rem - 30px)", overflow: "hidden" }}>
      <div ref={mapDivRef} style={{ position: "absolute", inset: 0, zIndex: 1 }} />

      {loadError && (
        <div style={{ position: "absolute", inset: 0, zIndex: 5, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div className="card-paper" style={{ padding: 24, textAlign: "center", maxWidth: 320 }}>
            <p className="handwritten" style={{ fontSize: 22, color: "var(--warning)" }}>map library blocked</p>
            <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 8 }}>
              This sandbox couldn't load Leaflet from the CDN. The deployed demo loads it normally.
            </p>
          </div>
        </div>
      )}
      {tilesBlocked && !loadError && (
        <div style={{ position: "absolute", top: 56, left: "50%", transform: "translateX(-50%)", zIndex: 8 }}>
          <div style={{ background: "rgba(27,42,74,0.92)", color: "var(--cream-soft)", fontSize: 11, padding: "6px 12px", borderRadius: 999 }}>
            map tiles blocked in this preview — markers & route still work, tiles load fine deployed
          </div>
        </div>
      )}

      {/* Layer chips */}
      <div style={{ position: "absolute", top: 12, left: 12, right: 12, zIndex: 10, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8, pointerEvents: "none" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, pointerEvents: "auto" }}>
          <LayerChip active={layers.beacons} onClick={() => setLayers((l) => ({ ...l, beacons: !l.beacons }))} icon={<Locate size={14} />}>riders</LayerChip>
          <LayerChip active={layers.route} onClick={() => setLayers((l) => ({ ...l, route: !l.route }))} icon={<MapPin size={14} />}>route</LayerChip>
          <LayerChip active={layers.hazards} onClick={() => setLayers((l) => ({ ...l, hazards: !l.hazards }))} icon={<TriangleAlert size={14} />}>hazard</LayerChip>
          <LayerChip active={layers.fuel} onClick={() => setLayers((l) => ({ ...l, fuel: !l.fuel }))} icon={<Fuel size={14} />}>fuel</LayerChip>
          <LayerChip active={layers.hotels} onClick={() => setLayers((l) => ({ ...l, hotels: !l.hotels }))} icon={<BedDouble size={14} />}>stay</LayerChip>
          <LayerChip active={layers.sideTrips} onClick={() => setLayers((l) => ({ ...l, sideTrips: !l.sideTrips }))} icon={<MapPin size={14} />}>side trips</LayerChip>
        </div>
        {layers.sideTrips && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, pointerEvents: "auto", padding: "4px 8px", borderRadius: 8, background: "rgba(244,233,208,0.92)", border: "1.5px solid var(--ink)", fontSize: 10 }}>
            <img src={MARKER_ICONS.sideTrip} alt="" width={16} height={19} style={{ display: "block" }} />
            <span style={{ color: "#E07B2A", fontWeight: 700 }}>= suggested side trip</span>
          </div>
        )}
      </div>

      {/* All India + rider pill */}
      <button onClick={zoomAllIndia} title="Zoom out to all of India" style={{
        position: "absolute", bottom: 96, left: 16, zIndex: 20, display: "flex", alignItems: "center", gap: 6,
        padding: "8px 12px", fontSize: 12, fontWeight: 600, borderRadius: 999, fontFamily: "inherit",
        background: "var(--cream-soft)", color: "var(--ink)", border: "2px solid var(--ink)", boxShadow: "2px 2px 0 var(--ink)", cursor: "pointer",
      }}><Globe size={14} /> All India</button>

      <div style={{ position: "absolute", bottom: 16, left: 16, zIndex: 10 }}>
        <div style={{ padding: "4px 10px", fontSize: 11, fontWeight: 600, borderRadius: 999, background: "var(--cream-soft)", color: "var(--ink)", border: "2px solid var(--ink)", boxShadow: "2px 2px 0 var(--ink)" }}>
          {riders.length} joined · {pins.length} pin{pins.length === 1 ? "" : "s"}
        </div>
      </div>

      {/* FAB + picker */}
      <div style={{ position: "absolute", bottom: 16, right: 16, zIndex: 20, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
        {picker && (
          <div className="card-paper rb-fade" style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8, minWidth: 250 }}>
            <div style={{ display: "flex", gap: 6 }} role="tablist" aria-label="Pin type">
              <PickerTab active={picker === "checkin"} onClick={() => setPicker("checkin")} color="var(--teal)"><Locate size={13} /> Check in</PickerTab>
              <PickerTab active={picker === "hazard"} onClick={() => setPicker("hazard")} color="var(--warning)"><TriangleAlert size={13} /> Hazard</PickerTab>
              <PickerTab active={picker === "side"} onClick={() => setPicker("side")} color="#E07B2A"><MapPin size={13} /> Side trip</PickerTab>
            </div>
            <textarea className="input-paper" rows={2} style={{ fontSize: 13, resize: "none", padding: "8px 10px" }}
              placeholder={picker === "checkin" ? "Note (optional) — hotel name, chai stop…"
                : picker === "hazard" ? "Describe the hazard (optional)"
                : "What's this place? Viewpoint, monastery, a favourite chai stop…"}
              value={pickerNote} onChange={(e) => setPickerNote(e.target.value)} />
            <button onClick={() => drop(picker)} disabled={pickerBusy} style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              padding: "8px 12px", fontSize: 13, fontWeight: 600, borderRadius: 6, fontFamily: "inherit", cursor: "pointer",
              background: picker === "checkin" ? "var(--teal)" : picker === "hazard" ? "var(--warning)" : "#E07B2A",
              color: "var(--cream-soft)", border: "2px solid var(--ink)", opacity: pickerBusy ? 0.6 : 1,
            }}>
              {pickerBusy ? "Saving…" : picker === "checkin" ? "Drop check-in here" : picker === "hazard" ? "Log hazard here" : "Save side trip here"}
            </button>
            <p style={{ fontSize: 10, lineHeight: 1.4, color: "var(--ink-soft)", margin: 0 }}>
              {picker === "side"
                ? "Stays on the map till the ride archive closes."
                : "Demo GPS: a point near Rampur stands in for your real location."}
            </p>
          </div>
        )}
        <button className="btn-primary" aria-label={picker ? "close" : "check in"}
          onClick={() => { setPicker((p) => (p ? null : "checkin")); setPickerNote(""); }}
          style={{ width: 64, height: 64, padding: 0, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {picker ? <X size={28} /> : <Plus size={28} />}
        </button>
      </div>

      {/* Danger-zone banner */}
      {!bannerGone && dz && (
        <div style={{ position: "absolute", bottom: 112, left: 12, right: 12, zIndex: 10 }}>
          <div className="card-paper rb-fade" style={{ padding: 12, background: "#fff1e8", borderColor: "var(--warning)", boxShadow: "3px 3px 0 var(--warning)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <TriangleAlert size={18} color="var(--warning)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--warning)" }}>
                  {dz.name} · {dz.approx_km} km
                </div>
                <div style={{ fontSize: 12, color: "var(--ink)", marginTop: 2 }}>{dz.warning}</div>
              </div>
              <button onClick={() => setBannerGone(true)} aria-label="dismiss" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-soft)", flexShrink: 0 }}>
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div style={{ position: "absolute", bottom: 96, left: "50%", transform: "translateX(-50%)", zIndex: 30, animation: "rb-toast-in 200ms ease both" }}>
          <div style={{ padding: "8px 16px", fontSize: 13, fontWeight: 600, borderRadius: 999, background: "var(--ink)", color: "var(--cream-soft)", boxShadow: "2px 2px 0 rgba(0,0,0,0.3)", whiteSpace: "nowrap" }}>
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════ CHAT TAB ═════════════════════════════ */
function ChatTab({ riders, messages, onSend }) {
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const fmtTime = (iso) => new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function send() {
    const body = draft.trim();
    if (!body) return;
    onSend(body);
    setDraft("");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 5rem - 30px)", maxWidth: 448, margin: "0 auto" }} className="above-grain">
      <div style={{ padding: "20px 20px 8px" }}>
        <h1 className="display" style={{ fontSize: 30, color: "var(--ink)", margin: 0 }}>chat</h1>
        <p className="handwritten" style={{ fontSize: 20, color: "var(--teal)", margin: "2px 0 0" }}>{riders.length} on the road</p>
      </div>
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "0 14px 8px", display: "flex", flexDirection: "column", gap: 8 }}>
        {messages.map((m) => {
          const mine = m.rider_id === YOU.id;
          const rider = riderById(riders, m.rider_id);
          return (
            <div key={m.id} style={{ display: "flex", justifyContent: mine ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth: "78%" }}>
                {!mine && (
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--ink-soft)", marginBottom: 2, padding: "0 4px" }}>
                    {rider?.avatar ?? "🏍️"} {rider?.name ?? "rider"}
                  </div>
                )}
                <div style={{
                  borderRadius: 12, padding: "8px 12px", fontSize: 14,
                  background: mine ? "var(--orange)" : "var(--cream-soft)",
                  color: mine ? "var(--cream-soft)" : "var(--ink)",
                  border: "2px solid var(--ink)", boxShadow: "2px 2px 0 var(--ink)",
                }}>{m.body}</div>
                <div style={{ fontSize: 10, color: "var(--ink-soft)", marginTop: 2, padding: "0 4px", textAlign: "right" }}>{fmtTime(m.created_at)}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ padding: "8px 12px 12px", display: "flex", gap: 8, borderTop: "2px solid var(--ink)" }}>
        <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} className="input-paper" style={{ flex: 1, padding: "10px 14px" }} placeholder="say something…" maxLength={500} />
        <button onClick={send} disabled={!draft.trim()} className="btn-primary" style={{ padding: "10px 14px", minWidth: 52, display: "flex", alignItems: "center", justifyContent: "center" }} aria-label="send">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════ PLAN TAB ═════════════════════════════ */
function PlanTab({ savedPlan, onSavePlan }) {
  const saved0 = savedPlan;
  const initialStart = saved0?.start_city ?? "Delhi";
  const isKnown = START_CITIES.some((c) => c.name === initialStart);

  const [startMode, setStartMode] = useState(isKnown ? "preset" : "custom");
  const [startCity, setStartCity] = useState(isKnown ? initialStart : "Delhi");
  const [customInput, setCustomInput] = useState(isKnown ? "" : initialStart);
  const [customGeo, setCustomGeo] = useState<any>(isKnown ? null : DEMO_CITIES[initialStart.toLowerCase()] ?? null);
  const [geocodeError, setGeocodeError] = useState<string | null>(null);
  const [paceKmpd, setPaceKmpd] = useState(saved0?.pace_kmpd ?? 350);
  const [customPaceInput, setCustomPaceInput] = useState("");
  const [kinnaurCustom, setKinnaurCustom] = useState<any[] | null>(saved0?.kinnaur ?? null);
  const [freeStages, setFreeStages] = useState<any[] | null>(saved0?.free ?? null);
  const [saving, setSaving] = useState(false);
  const [savedTick, setSavedTick] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(saved0?.updated_at ?? null);

  const resolvedStartCity = startMode === "preset" ? startCity : (customGeo?.name ?? "Delhi");
  const isCustom = startMode === "custom" && customGeo;

  const preJourneyKm = useMemo(() => (isCustom ? Math.round(haversineKm(customGeo, CHANDIGARH)) : 0), [isCustom, customGeo]);
  const preJourneyDayCount = preJourneyKm > 0 ? Math.ceil(preJourneyKm / paceKmpd) : 0;
  const kmPerPreDay = preJourneyDayCount > 0 ? Math.round(preJourneyKm / preJourneyDayCount) : 0;

  const computedFreeStages = useMemo(() => {
    if (!isCustom || preJourneyDayCount === 0) return [];
    if (freeStages && freeStages.length > 0) return freeStages;
    const rows = [];
    for (let i = 0; i < preJourneyDayCount; i++) {
      rows.push({ day: i + 1, from: i === 0 ? customGeo.name : "", to: i === preJourneyDayCount - 1 ? "Chandigarh" : "", km: kmPerPreDay });
    }
    return rows;
  }, [isCustom, preJourneyDayCount, freeStages, customGeo, kmPerPreDay]);

  const mainLegStart = startMode === "preset" ? startCity : "Chandigarh";
  const kinnaurGenerated = useMemo(() => planDayStages(STAGES, mainLegStart, paceKmpd), [mainLegStart, paceKmpd]);
  const kinnaurPlan = kinnaurCustom ?? kinnaurGenerated;
  const kinnaurOffset = computedFreeStages.length;

  function setFreeStageField(idx, field, value) {
    const next = [...computedFreeStages];
    if (field === "km") {
      const km = parseInt(value, 10);
      next[idx] = { ...next[idx], km: Number.isFinite(km) && km >= 0 ? km : 0 };
    } else {
      next[idx] = { ...next[idx], [field]: value };
      if (field === "to" && next[idx + 1]) next[idx + 1] = { ...next[idx + 1], from: value };
    }
    setFreeStages(next);
  }
  function addFreeStageDay() {
    const base = computedFreeStages;
    const lastRow = base[base.length - 1];
    const newDay = { day: base.length + 1, from: lastRow?.to ?? "", to: "Chandigarh", km: Math.max(50, Math.round(paceKmpd / 2)) };
    const next = [...base];
    if (lastRow && lastRow.to === "Chandigarh") { next[next.length - 1] = { ...lastRow, to: "" }; next.push(newDay); }
    else next.push(newDay);
    next.forEach((s, i) => (s.day = i + 1));
    setFreeStages(next);
  }
  function removeFreeStageDay(idx) {
    const base = computedFreeStages;
    if (base.length <= 1) return;
    const next = base.filter((_, i) => i !== idx);
    if (next[idx - 1] && next[idx]) next[idx] = { ...next[idx], from: next[idx - 1].to };
    next.forEach((s, i) => (s.day = i + 1));
    setFreeStages(next);
  }
  function setKinnaurTarget(dayIdx, townName) {
    const town = TOWN_OPTIONS.find((t) => t.name === townName);
    if (!town) return;
    const next = [...kinnaurPlan];
    next[dayIdx] = { ...next[dayIdx], to: town.name, to_lat: town.lat, to_lng: town.lng };
    if (next[dayIdx + 1]) next[dayIdx + 1] = { ...next[dayIdx + 1], from: town.name };
    setKinnaurCustom(next);
  }
  function setKinnaurOrigin(fromName) {
    const next = [...kinnaurPlan];
    next[0] = { ...next[0], from: fromName };
    setKinnaurCustom(next);
  }
  function geocode() {
    setGeocodeError(null);
    setFreeStages(null);
    const hit = DEMO_CITIES[customInput.trim().toLowerCase()];
    if (hit) setCustomGeo(hit);
    else setGeocodeError("Demo geocoder knows the major metros — try Kochi, Mumbai, Pune… (production uses Nominatim)");
  }
  function save() {
    setSaving(true);
    setTimeout(() => {
      const now = new Date().toISOString();
      onSavePlan({
        start_city: resolvedStartCity, pace_kmpd: paceKmpd,
        free: computedFreeStages, kinnaur: kinnaurPlan, updated_at: now,
        stages: [
          ...computedFreeStages.map((s) => ({ ...s })),
          ...kinnaurPlan.map((s) => ({ day: s.day + kinnaurOffset, from: s.from, to: s.to, km: s.km })),
        ],
      });
      setLastSavedAt(now);
      setSaving(false); setSavedTick(true);
      setTimeout(() => setSavedTick(false), 2000);
    }, 350);
  }

  const totalKm = kinnaurPlan.reduce((s, d) => s + d.km, 0) + preJourneyKm;
  const totalDays = kinnaurPlan.length + preJourneyDayCount;
  const fmtSavedAt = (iso) => new Date(iso).toLocaleString(undefined, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
  const inputSm = { padding: "5px 8px", fontSize: 13 };

  return (
    <main className="above-grain" style={{ maxWidth: 448, margin: "0 auto", padding: "24px 20px 130px" }}>
      <h1 className="display" style={{ fontSize: 30, color: "var(--ink)", margin: 0 }}>plan</h1>
      <p className="handwritten" style={{ fontSize: 20, color: "var(--teal)", margin: "4px 0 0" }}>
        {totalDays} days · {totalKm} km total
      </p>

      <section style={{ marginTop: 24 }}>
        <label className="field-label">Starting from</label>
        <select className="input-paper" value={startMode === "custom" ? "__custom__" : startCity}
          onChange={(e) => {
            if (e.target.value === "__custom__") setStartMode("custom");
            else { setStartMode("preset"); setStartCity(e.target.value); setCustomGeo(null); setFreeStages(null); setKinnaurCustom(null); }
          }}>
          {START_CITIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
          <option value="__custom__">Other city…</option>
        </select>
        {startMode === "custom" && (
          <div style={{ marginTop: 8 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <input className="input-paper" style={{ flex: 1 }} placeholder="e.g. Kochi, Bengaluru, Pune"
                value={customInput} onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && geocode()} />
              <button onClick={geocode} className="btn-primary" style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                <Search size={15} /> Find
              </button>
            </div>
            {geocodeError && <p style={{ fontSize: 12, marginTop: 4, color: "var(--warning)" }}>{geocodeError}</p>}
          </div>
        )}
      </section>

      <section style={{ marginTop: 20 }}>
        <label className="field-label">Pace</label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
          {PACE_PROFILES.map((p) => {
            const active = paceKmpd === p.kmpd && !customPaceInput;
            return (
              <button key={p.id} onClick={() => { setPaceKmpd(p.kmpd); setCustomPaceInput(""); setKinnaurCustom(null); setFreeStages(null); }}
                style={{
                  width: "100%", textAlign: "left", padding: "8px 12px", borderRadius: 10, fontFamily: "inherit", cursor: "pointer",
                  background: active ? "var(--teal)" : "var(--cream-soft)", color: active ? "var(--cream-soft)" : "var(--ink)",
                  border: "2px solid var(--ink)", boxShadow: "2px 2px 0 var(--ink)",
                }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{p.label} · {p.kmpd} km/day</div>
                <div style={{ fontSize: 12, opacity: 0.9 }}>{p.hint}</div>
              </button>
            );
          })}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
            <label className="field-label" style={{ marginBottom: 0, flexShrink: 0 }}>Custom km/day</label>
            <input type="number" min={50} max={1000} className="input-paper" style={{ ...inputSm, width: 110, textAlign: "center" }} placeholder="e.g. 250"
              value={customPaceInput}
              onChange={(e) => {
                setCustomPaceInput(e.target.value);
                const v = parseInt(e.target.value);
                if (v >= 50 && v <= 1000) { setPaceKmpd(v); setKinnaurCustom(null); setFreeStages(null); }
              }} />
          </div>
        </div>
      </section>

      {computedFreeStages.length > 0 && (
        <section style={{ marginTop: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <label className="field-label" style={{ marginBottom: 0 }}>
              Phase 1 · Into the mountains
              <span style={{ display: "block", fontSize: 11, fontWeight: 400, color: "var(--ink-soft)", textTransform: "none", letterSpacing: "normal" }}>
                {computedFreeStages.length} day{computedFreeStages.length === 1 ? "" : "s"} · {computedFreeStages.reduce((s, d) => s + (d.km || 0), 0)} km · ends at Chandigarh
              </span>
            </label>
            {freeStages && (
              <button onClick={() => setFreeStages(null)} style={{ fontSize: 12, textDecoration: "underline", color: "var(--ink-soft)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>reset</button>
            )}
          </div>
          <ol style={{ listStyle: "none", padding: 0, margin: "4px 0 0", display: "flex", flexDirection: "column", gap: 8 }}>
            {computedFreeStages.map((d, i) => (
              <li key={i} className="card-paper" style={{ padding: 12 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--brown)" }}>Day {d.day}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <input type="number" min={0} max={2000} className="input-paper" style={{ ...inputSm, width: 76, textAlign: "center", fontSize: 12 }}
                      value={d.km} onChange={(e) => setFreeStageField(i, "km", e.target.value)} />
                    <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>km</span>
                    {computedFreeStages.length > 1 && (
                      <button type="button" onClick={() => removeFreeStageDay(i)} aria-label="remove day" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-soft)", marginLeft: 4 }}>
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input className="input-paper" style={{ ...inputSm, flex: 1 }} placeholder="From…" value={d.from} onChange={(e) => setFreeStageField(i, "from", e.target.value)} />
                  <span style={{ color: "var(--ink-soft)" }}>→</span>
                  <input className="input-paper" style={{ ...inputSm, flex: 1 }} placeholder="Overnight stop…" value={d.to} onChange={(e) => setFreeStageField(i, "to", e.target.value)} />
                </div>
              </li>
            ))}
            <li style={{ display: "flex", justifyContent: "center" }}>
              <button type="button" onClick={addFreeStageDay} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, padding: "6px 12px", borderRadius: 999, border: "2px dashed var(--ink)", color: "var(--ink-soft)", background: "none", cursor: "pointer", fontFamily: "inherit" }}>
                <PlusCircle size={13} /> Add day
              </button>
            </li>
          </ol>
          <p style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 8, lineHeight: 1.5 }}>
            Tip: edit the km per day to match what you can realistically ride — longer first day, rest on a tough
            stretch, etc. We pre-fill from {preJourneyKm} km at {paceKmpd} km/day but it's your call.
          </p>
        </section>
      )}

      <section style={{ marginTop: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <label className="field-label" style={{ marginBottom: 0 }}>
            {computedFreeStages.length > 0 ? "Phase 2 · Onward to Kaza" : "The ride · Onward to Kaza"}
            <span style={{ display: "block", fontSize: 11, fontWeight: 400, color: "var(--ink-soft)", textTransform: "none", letterSpacing: "normal" }}>
              {kinnaurPlan[0]?.from ?? "Start"} → Kaza · {kinnaurPlan.length} day{kinnaurPlan.length === 1 ? "" : "s"} · {kinnaurPlan.reduce((s, d) => s + d.km, 0)} km
            </span>
          </label>
          {kinnaurCustom && (
            <button onClick={() => setKinnaurCustom(null)} style={{ fontSize: 12, textDecoration: "underline", color: "var(--ink-soft)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>reset</button>
          )}
        </div>
        <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {kinnaurPlan.map((d, i) => (
            <React.Fragment key={i}>
              <li className="card-paper" style={{ padding: 12 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--brown)" }}>Day {kinnaurOffset + d.day}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>{d.km} km</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                  {i === 0 ? (
                    <input className="input-paper" style={{ ...inputSm, flex: 1 }} value={d.from} onChange={(e) => setKinnaurOrigin(e.target.value)} placeholder="Origin" />
                  ) : (
                    <span style={{ fontSize: 14, fontWeight: 600, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.from}</span>
                  )}
                  <span style={{ color: "var(--ink-soft)" }}>→</span>
                  <select value={d.to} onChange={(e) => setKinnaurTarget(i, e.target.value)} className="input-paper" style={{ ...inputSm, flex: 1 }}>
                    {TOWN_OPTIONS.map((t) => <option key={t.name} value={t.name}>{t.name}</option>)}
                  </select>
                </div>
              </li>
              {i === 1 && (
                <li style={{ display: "flex", justifyContent: "center" }}>
                  <button onClick={() => {
                    const next = [...kinnaurPlan];
                    const kaza = TOWN_OPTIONS.find((t) => t.name === "Kaza") ?? TOWN_OPTIONS[TOWN_OPTIONS.length - 1];
                    next.splice(2, 0, { day: next[1].day + 1, from: next[1].to, to: kaza.name, km: 0, to_lat: kaza.lat, to_lng: kaza.lng });
                    next.forEach((s, idx) => { s.day = idx + 1; });
                    setKinnaurCustom(next);
                  }} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, padding: "6px 12px", borderRadius: 999, border: "2px dashed var(--ink)", color: "var(--ink-soft)", background: "none", cursor: "pointer", fontFamily: "inherit" }}>
                    <PlusCircle size={13} /> Add stop
                  </button>
                </li>
              )}
            </React.Fragment>
          ))}
        </ol>
      </section>

      <div style={{ marginTop: 24, position: "sticky", bottom: 110, zIndex: 5 }}>
        <button onClick={save} disabled={saving} className="btn-primary" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          {savedTick ? <Check size={18} /> : <Save size={18} />}
          {savedTick ? "saved" : saving ? "saving…" : "save plan"}
        </button>
        {lastSavedAt && (
          <p style={{ fontSize: 12, textAlign: "center", color: "var(--ink-soft)", marginTop: 8 }}>
            last saved {fmtSavedAt(lastSavedAt)} · visible on your Me page
          </p>
        )}
      </div>
    </main>
  );
}

/* ════════════════════════════ ME TAB ═══════════════════════════════ */
function Modal({ onClose, children }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(27,42,74,0.5)", display: "flex", alignItems: "flex-start", justifyContent: "center", overflowY: "auto", padding: "24px 16px" }}>
      <div onClick={(e) => e.stopPropagation()} className="rb-fade" style={{ width: "100%", maxWidth: 420 }}>
        {children}
      </div>
    </div>
  );
}

/* Public ICE card — replica of /r/[rider_id]/ice */
function IceCard({ rider, onClose }) {
  return (
    <Modal onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ display: "inline-block", padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", background: "var(--warning)", color: "var(--cream-soft)", border: "2px solid var(--ink)", boxShadow: "2px 2px 0 var(--ink)" }}>
            In case of emergency
          </div>
        </div>
        <section className="card-paper" style={{ padding: 20, textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 8, filter: "drop-shadow(2px 2px 0 rgba(27,42,74,0.15))" }} aria-hidden>{rider.avatar}</div>
          <div className="handwritten" style={{ fontSize: 17, color: "var(--teal)" }}>this is</div>
          <h1 className="display" style={{ fontSize: 34, color: "var(--ink)", margin: 0 }}>{rider.name}</h1>
          <div style={{ fontSize: 14, color: "var(--ink-soft)", marginTop: 4 }}>{rider.bike}</div>
        </section>
        <section className="card-paper" style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Heart size={16} color="var(--warning)" />
            <div className="handwritten" style={{ fontSize: 17, color: "var(--warning)" }}>blood group</div>
          </div>
          <div className="display" style={{ fontSize: 44, textAlign: "center", color: "var(--ink)" }}>{rider.blood || "—"}</div>
        </section>
        <section className="card-paper" style={{ padding: 20 }}>
          <div className="handwritten" style={{ fontSize: 17, color: "var(--teal)", marginBottom: 8 }}>call for them</div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            {(rider.ice ?? []).map((c, i) => (
              <li key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 12, borderRadius: 10, background: "var(--cream)", border: "2px solid var(--ink)" }}>
                <div>
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--ink-soft)" }}>{c.name}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)" }}>{c.phone}</div>
                </div>
                <span style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700, textTransform: "uppercase", background: "var(--orange)", color: "var(--cream-soft)" }}>
                  <Phone size={14} /> Call
                </span>
              </li>
            ))}
            <li style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 12, borderRadius: 10, background: "var(--cream-soft)", border: "2px dashed var(--ink)" }}>
              <div>
                <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--ink-soft)" }}>India emergency</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)" }}>112</div>
              </div>
              <span style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700, textTransform: "uppercase", background: "var(--warning)", color: "var(--cream-soft)" }}>
                <Phone size={14} /> Call
              </span>
            </li>
          </ul>
        </section>
        <p style={{ textAlign: "center", fontSize: 11, color: "rgba(250,243,225,0.85)" }}>
          Shared voluntarily by the rider · Ride Buds — in production this is a public link
          first-responders can open from a QR sticker, no login needed.
        </p>
        <button className="btn-primary" onClick={onClose} style={{ width: "100%" }}>Close</button>
      </div>
    </Modal>
  );
}

function SosModal({ rider, onClose }) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${DEMO_GPS.lat.toFixed(5)},${DEMO_GPS.lng.toFixed(5)}`;
  const body = `SOS — ${rider.name} needs help.\nLocation: ${mapsUrl}\nMedical info: https://ridebuds-demo/ice/${rider.id}\nSent from Ride Buds.`;
  return (
    <Modal onClose={onClose}>
      <div className="card-paper" style={{ padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Siren size={20} color="var(--warning)" />
          <h2 className="display" style={{ fontSize: 20, color: "var(--ink)", margin: 0 }}>SOS — demo</h2>
        </div>
        <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 10, lineHeight: 1.55 }}>
          In production this button grabs your live GPS fix and opens your phone's SMS composer,
          pre-addressed to your emergency contacts with this message:
        </p>
        <pre style={{ background: "var(--cream)", border: "2px solid var(--ink)", borderRadius: 10, padding: 12, fontSize: 12, whiteSpace: "pre-wrap", color: "var(--ink)", fontFamily: "ui-monospace, monospace" }}>{body}</pre>
        <p style={{ fontSize: 12, color: "var(--ink-soft)", lineHeight: 1.5 }}>
          To: {(rider.ice ?? []).map((c) => `${c.name} (${c.phone})`).join(", ")}. SMS, not WhatsApp —
          it works on the BSNL-only stretches past Reckong Peo where data dies.
        </p>
        <button className="btn-primary" onClick={onClose} style={{ width: "100%", marginTop: 8 }}>Got it</button>
      </div>
    </Modal>
  );
}

function MeTab({ savedPlan, stayNotes, setStayNotes, onLeave }) {
  const [showIce, setShowIce] = useState(false);
  const [showSos, setShowSos] = useState(false);
  const [notesDraft, setNotesDraft] = useState(stayNotes ?? "");
  const [notesSaving, setNotesSaving] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const rider = YOU;
  const stages = savedPlan?.stages ?? [];
  const totalKm = stages.reduce((s, x) => s + (x.km ?? 0), 0);

  function saveNotes() {
    setNotesSaving(true);
    setTimeout(() => {
      setStayNotes(notesDraft.trim() || null);
      setNotesSaving(false); setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 2000);
    }, 300);
  }
  async function copyIce() {
    try { await navigator.clipboard.writeText("https://ridebuds-demo/ice/" + rider.id); setStatus("ICE link copied (demo URL)"); }
    catch { setStatus("copy blocked in this sandbox — works deployed"); }
  }

  return (
    <main className="above-grain" style={{ maxWidth: 448, margin: "0 auto", padding: "20px 20px 120px", display: "flex", flexDirection: "column", gap: 22 }}>
      <header>
        <div className="handwritten" style={{ fontSize: 15, color: "var(--teal)" }}>rider</div>
        <h1 className="display" style={{ fontSize: 46, color: "var(--ink)", margin: 0 }}>ME</h1>
      </header>

      <section className="card-paper" style={{ padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, borderRadius: 10, background: "var(--cream)", border: "2px solid var(--ink)" }}>
            {rider.avatar}
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "var(--ink)" }}>{rider.name}</div>
            <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>{rider.bike} · {formatPhoneForDisplay(rider.phone)}</div>
          </div>
        </div>
      </section>

      <section className="card-paper" style={{ padding: 16 }}>
        <div className="handwritten" style={{ fontSize: 17, color: "var(--teal)" }}>in case of emergency</div>
        <div style={{ marginTop: 8, fontSize: 14, color: "var(--ink)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
            <span style={{ color: "var(--ink-soft)" }}>Blood group</span>
            <span style={{ fontWeight: 600 }}>{rider.blood}</span>
          </div>
          {rider.ice.map((c, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
              <span style={{ color: "var(--ink-soft)" }}>{c.name}</span>
              <span style={{ fontWeight: 600, textDecoration: "underline" }}>{c.phone}</span>
            </div>
          ))}
        </div>
        <button onClick={() => setShowIce(true)} style={{ display: "block", width: "100%", marginTop: 12, textAlign: "center", fontSize: 12, fontWeight: 600, textDecoration: "underline", color: "var(--ink-soft)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
          View public ICE card →
        </button>
      </section>

      <section className="card-paper" style={{ padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div className="handwritten" style={{ fontSize: 17, color: "var(--teal)" }}>my plan</div>
          <span style={{ fontSize: 12, color: "var(--ink-soft)" }}>edit on the Plan tab</span>
        </div>
        {stages.length === 0 ? (
          <p style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 8 }}>
            No itinerary saved yet. Plan your days on the <strong>Plan</strong> tab and hit save — it'll stick to this rider profile.
          </p>
        ) : (
          <>
            <div style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 4 }}>
              from <span style={{ fontWeight: 600, color: "var(--ink)" }}>{savedPlan.start_city}</span>
              {" · "}{stages.length} day{stages.length === 1 ? "" : "s"} · {totalKm} km · {savedPlan.pace_kmpd} km/day pace
            </div>
            <table style={{ width: "100%", marginTop: 12, fontSize: 12, color: "var(--ink)", borderCollapse: "collapse" }}>
              <tbody>
                {stages.map((s, i) => (
                  <tr key={i} style={{ borderTop: "1px dashed rgba(27,42,74,0.2)" }}>
                    <td style={{ padding: "6px 8px 6px 0", color: "var(--ink-soft)", width: 44, whiteSpace: "nowrap" }}>Day {s.day}</td>
                    <td style={{ padding: "6px 0", fontWeight: 600 }}>{s.from || "—"} <span style={{ color: "var(--ink-soft)", fontWeight: 400 }}>→</span> {s.to || "—"}</td>
                    <td style={{ padding: "6px 0 6px 8px", textAlign: "right", color: "var(--ink-soft)", width: 56, whiteSpace: "nowrap" }}>{s.km} km</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {savedPlan.updated_at && (
              <div style={{ fontSize: 10, color: "var(--ink-soft)", marginTop: 8, textAlign: "right" }}>
                saved {new Date(savedPlan.updated_at).toLocaleString(undefined, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}
              </div>
            )}
          </>
        )}
      </section>

      <section className="card-paper" style={{ padding: 16 }}>
        <div className="handwritten" style={{ fontSize: 17, color: "var(--teal)" }}>
          kaza stay details <span style={{ fontSize: 13, color: "var(--ink-soft)", fontWeight: 400 }}>(optional)</span>
        </div>
        <textarea className="input-paper" rows={3} style={{ marginTop: 8, fontSize: 13, resize: "none" }}
          placeholder="e.g. Hotel Deyzor, room 12 · arriving May 2 evening"
          value={notesDraft} onChange={(e) => setNotesDraft(e.target.value)} maxLength={500} />
        <button onClick={saveNotes} disabled={notesSaving} style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", fontSize: 12, fontWeight: 600, borderRadius: 6, background: "var(--ink)", color: "var(--cream-soft)", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
          {notesSaved ? <Check size={13} /> : <Save size={13} />}
          {notesSaved ? "saved" : notesSaving ? "saving…" : "save"}
        </button>
      </section>

      <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <button onClick={() => setShowSos(true)} style={{
          width: "100%", borderRadius: 12, padding: "16px", display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
          fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, fontSize: 18, fontFamily: "inherit", cursor: "pointer",
          background: "var(--warning)", color: "var(--cream-soft)", border: "2px solid var(--ink)", boxShadow: "3px 3px 0 var(--ink)",
        }}>
          <Siren size={22} /> SOS — message my contacts
        </button>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setStatus("dials 112 on a real phone")} style={{ flex: 1, borderRadius: 10, padding: "10px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 13, fontWeight: 600, fontFamily: "inherit", cursor: "pointer", background: "var(--cream-soft)", color: "var(--ink)", border: "2px solid var(--ink)" }}>
            <Phone size={16} /> Call 112
          </button>
          <button onClick={copyIce} style={{ flex: 1, borderRadius: 10, padding: "10px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 13, fontWeight: 600, fontFamily: "inherit", cursor: "pointer", background: "var(--cream-soft)", color: "var(--ink)", border: "2px solid var(--ink)" }}>
            <Share2 size={16} /> Share ICE
          </button>
          <button onClick={copyIce} aria-label="copy ICE link" style={{ borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit", cursor: "pointer", background: "var(--cream-soft)", color: "var(--ink)", border: "2px solid var(--ink)" }}>
            <Copy size={16} />
          </button>
        </div>
        {status && <p style={{ fontSize: 12, textAlign: "center", color: "var(--ink-soft)", margin: 0 }}>{status}</p>}
      </section>

      <section className="card-paper" style={{ padding: 16 }}>
        <div className="handwritten" style={{ fontSize: 17, color: "var(--teal)" }}>road notes</div>
        <ul style={{ marginTop: 8, fontSize: 12, color: "var(--ink)", paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8, lineHeight: 1.5 }}>
          <li><strong>Inner Line Permit</strong> — required between Jangi and Sumdo (Hangrang / Sumdo checkpoint). Carry a printed copy + photo ID.</li>
          <li><strong>AMS warning</strong> — Nako (3,625 m) and Kaza (3,800 m) are high altitude. Go slow the first day, hydrate, no alcohol. Descend if headaches + nausea persist.</li>
          <li><strong>Signal</strong> — BSNL-only past Reckong Peo. Airtel/Jio drop out around Pooh.</li>
        </ul>
      </section>

      <section style={{ textAlign: "center", paddingTop: 8 }}>
        <button onClick={onLeave} style={{ fontSize: 12, textDecoration: "underline", color: "var(--ink-soft)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
          Leave ride (clear session)
        </button>
      </section>

      {showIce && <IceCard rider={rider} onClose={() => setShowIce(false)} />}
      {showSos && <SosModal rider={rider} onClose={() => setShowSos(false)} />}
    </main>
  );
}

/* ═══════════════════════════ ABOUT TAB ═════════════════════════════ */
function AboutTab() {
  const Decision = ({ title, children }) => (
    <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--ink)", margin: "10px 0 0" }}>
      <strong>{title}</strong> {children}
    </p>
  );
  const Row = ({ k, v }) => (
    <tr style={{ borderTop: "1px dashed rgba(27,42,74,0.2)" }}>
      <td style={{ padding: "6px 10px 6px 0", color: "var(--ink-soft)", whiteSpace: "nowrap", verticalAlign: "top" }}>{k}</td>
      <td style={{ padding: "6px 0", color: "var(--ink)" }}>{v}</td>
    </tr>
  );
  return (
    <main className="above-grain" style={{ maxWidth: 448, margin: "0 auto", padding: "24px 20px 120px", display: "flex", flexDirection: "column", gap: 18 }}>
      <header>
        <div className="handwritten" style={{ fontSize: 15, color: "var(--teal)" }}>about this build</div>
        <h1 className="display" style={{ fontSize: 30, color: "var(--ink)", margin: 0 }}>RIDE BUDS</h1>
      </header>

      <section className="card-paper" style={{ padding: 16 }}>
        <div className="handwritten" style={{ fontSize: 17, color: "var(--teal)" }}>what it is</div>
        <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--ink)", margin: "8px 0 0" }}>
          A progressive web app for group motorcycle rallies in the Indian Himalayas, built solo for the
          Tank Up Kaza ride (Delhi → Kaza through Kinnaur). A crew joins with a shared ride code — no
          accounts — and gets a live map of each other's check-ins, community-flagged hazards, verified
          fuel stops on a 130 km no-fuel stretch, a pace-aware itinerary planner, group chat, and a
          QR-shareable emergency card with blood group and ICE contacts.
        </p>
      </section>

      <section className="card-paper" style={{ padding: 16 }}>
        <div className="handwritten" style={{ fontSize: 17, color: "var(--teal)" }}>production stack</div>
        <table style={{ width: "100%", marginTop: 8, fontSize: 12, borderCollapse: "collapse" }}>
          <tbody>
            <Row k="Frontend" v="Next.js App Router, TypeScript, Tailwind v4, PWA (service worker + install hint)" />
            <Row k="Backend" v="Supabase Postgres + Realtime; service-role writes, scoped JWT minted per session for Realtime" />
            <Row k="Auth" v="No accounts — ride code + name + phone, HttpOnly HMAC-signed cookie, phone-based dedup" />
            <Row k="Maps" v="Google Maps (@vis.gl/react-google-maps) + marker clustering; OSRM road-snapped route GeoJSON" />
            <Row k="Free APIs" v="Open-Meteo (weather + elevation in pin popups), Nominatim (geocoding, proxied + session-gated)" />
            <Row k="Hosting" v="Vercel" />
          </tbody>
        </table>
      </section>

      <section className="card-paper" style={{ padding: 16 }}>
        <div className="handwritten" style={{ fontSize: 17, color: "var(--teal)" }}>decisions worth mentioning</div>
        <Decision title="Check-ins, not tracking.">
          Continuous live location was the obvious feature and the wrong one — it drains batteries on
          12-hour riding days, dies anyway on the BSNL-only stretches past Reckong Peo, and riders
          didn't want surveillance. Location is shared only when you tap to check in. Pins expire on
          their own: check-ins after 24 h, hazards after 72 h, so the map stays current without a moderator.
        </Decision>
        <Decision title="No accounts at a trailhead.">
          Nobody creates a password on a gravel shoulder at 3,500 m. Joining is ride code + name +
          optional phone; the server signs an HttpOnly HMAC cookie and mints a row-scoped Supabase JWT
          for Realtime. Re-joining with the same phone (E.164-normalized) re-attaches to your existing
          rider record — same identity, zero login UX.
        </Decision>
        <Decision title="The route is data, not decoration.">
          The Delhi→Kaza line is a 488-point OSRM road-snapped GeoJSON with stage metadata baked into
          its properties. The itinerary planner segments it into day-stages by pace (relaxed / standard /
          fast / custom km-per-day), and a saved plan round-trips through one JSONB column using a
          coordinate-sentinel convention to keep free-text pre-journey days separate from structured
          mountain stages on rehydration.
        </Decision>
        <Decision title="Safety works offline-adjacent.">
          The SOS button composes an SMS — not a WhatsApp message — because SMS still goes through where
          data doesn't. Each rider gets a public ICE page (blood group, tap-to-call contacts) designed to
          be opened from a QR sticker on a helmet by someone who has never seen the app.
        </Decision>
        <Decision title="This demo is deliberately keyless.">
          Supabase is stripped (state in memory), Google Maps is swapped for Leaflet + OpenStreetMap, and
          the crew is generated by a seeded PRNG relative to today. Clone it, npm install, and it runs —
          no env vars, no billing account behind a portfolio piece. Open-Meteo stays real because it
          needs no key.
        </Decision>
      </section>

      <section className="card-paper" style={{ padding: 16 }}>
        <div className="handwritten" style={{ fontSize: 17, color: "var(--teal)" }}>about this demo</div>
        <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--ink)", margin: "8px 0 0" }}>
          Everything you can click is the real production UI and logic; what's replaced is the
          infrastructure. The riders, phone numbers and messages are fictional. Pin weather and
          elevation are fetched live from Open-Meteo. The production app served a real rally and its
          repo stays private; this demo's source is public.
        </p>
      </section>

      <section style={{ textAlign: "center", paddingBottom: 8 }}>
        <p style={{ fontSize: 12, color: "var(--ink-soft)", lineHeight: 1.6 }}>
          Built by <strong>Krishnaprasad K</strong> — Technical Lead, MTCO<br />
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><Github size={12} /> github.com/kp-mtco · shamrock.kp@gmail.com</span>
        </p>
      </section>
    </main>
  );
}

/* ═══════════════════════════ APP SHELL ═════════════════════════════ */
const NAV = [
  { id: "map", label: "Map", icon: MapIcon },
  { id: "chat", label: "Chat", icon: MessageCircle },
  { id: "plan", label: "Plan", icon: RouteIcon },
  { id: "me", label: "Me", icon: User },
  { id: "about", label: "About", icon: Info },
];

export default function App() {
  const [entered, setEntered] = useState(false);
  const [tab, setTab] = useState("map");
  const [pins, setPins] = useState(seedPins);
  const [messages, setMessages] = useState(seedMessages);
  const [savedPlan, setSavedPlan] = useState<any>(null);
  const [stayNotes, setStayNotes] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [unread, setUnread] = useState(0);
  const simRef = useRef(false);
  const tabRef = useRef(tab);
  tabRef.current = tab;

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  /* Live-activity simulation — in production this is Supabase Realtime
     pushing postgres_changes INSERTs; here a couple of staged events. */
  useEffect(() => {
    if (!entered || simRef.current) return;
    simRef.current = true;
    const t1 = setTimeout(() => {
      setPins((cur) => [{
        id: "live-1", type: "checkin", rider_id: "r2",
        lat: 31.8833 + 0.004, lng: 78.6333 - 0.006,
        note: "Made it to Nako! Lake walk before sundown 🏔️", created_at: new Date().toISOString(),
      }, ...cur]);
      setToast("🐺 Dhruv just checked in near Nako");
    }, 40000);
    const t2 = setTimeout(() => {
      setMessages((cur) => [...cur, { id: "live-m1", rider_id: "r2", body: "At Nako, dropped a beacon. Lake is unreal right now", created_at: new Date().toISOString() }]);
      if (tabRef.current !== "chat") setUnread((u) => u + 1);
      setToast("💬 new message from Dhruv");
    }, 47000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [entered]);

  const onDropPin = useCallback((pin) => setPins((cur) => [pin, ...cur]), []);
  const onDeletePin = useCallback((id) => { setPins((cur) => cur.filter((p) => p.id !== id)); setToast("pin deleted"); }, []);
  const onSend = useCallback((body) => {
    setMessages((cur) => [...cur, { id: `me-${Date.now()}`, rider_id: YOU.id, body, created_at: new Date().toISOString() }]);
  }, []);

  return (
    <div className="rb-root">
      <DemoBanner />
      {!entered ? (
        <Gateway onEnter={() => setEntered(true)} posterSrc="/tank-up-poster.jpg" />
      ) : (
        <>
          <div style={{ paddingBottom: 80 }}>
            {tab === "map" && <MapTab riders={CREW} pins={pins} onDropPin={onDropPin} onDeletePin={onDeletePin} toast={toast} setToast={setToast} />}
            {tab === "chat" && <ChatTab riders={CREW} messages={messages} onSend={onSend} />}
            {tab === "plan" && <PlanTab savedPlan={savedPlan} onSavePlan={(p) => { setSavedPlan(p); setToast("plan saved — see your Me page"); }} />}
            {tab === "me" && <MeTab savedPlan={savedPlan} stayNotes={stayNotes} setStayNotes={setStayNotes} onLeave={() => { setEntered(false); setTab("map"); }} />}
            {tab === "about" && <AboutTab />}
          </div>

          {tab !== "map" && toast && (
            <div style={{ position: "fixed", bottom: 96, left: "50%", transform: "translateX(-50%)", zIndex: 60, animation: "rb-toast-in 200ms ease both" }}>
              <div style={{ padding: "8px 16px", fontSize: 13, fontWeight: 600, borderRadius: 999, background: "var(--ink)", color: "var(--cream-soft)", boxShadow: "2px 2px 0 rgba(0,0,0,0.3)", whiteSpace: "nowrap" }}>{toast}</div>
            </div>
          )}

          <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 40, borderTop: "2px solid var(--ink)", background: "var(--cream-soft)", boxShadow: "0 -2px 0 rgba(27,42,74,0.06)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", maxWidth: 448, margin: "0 auto" }}>
              {NAV.map(({ id, label, icon: Icon }) => {
                const active = tab === id;
                return (
                  <button key={id} className="rb-nav-btn" onClick={() => { setTab(id); if (id === "chat") setUnread(0); }}
                    style={{ color: active ? "var(--orange)" : "var(--ink)", position: "relative" }}>
                    <Icon size={22} strokeWidth={2.25} />
                    <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</span>
                    {id === "chat" && unread > 0 && (
                      <span style={{ position: "absolute", top: 6, right: "calc(50% - 22px)", width: 16, height: 16, borderRadius: 999, background: "var(--orange)", color: "var(--cream-soft)", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid var(--ink)" }}>{unread}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>
        </>
      )}
    </div>
  );
}
