import React, { useState, useContext, useEffect } from "react";
import { useNavigate  } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { DataGrid } from "@mui/x-data-grid";
import { useGetTransactionsQuery, paymentApi } from "state/api";
import Header from "components/Header";
import { Box, useTheme, useMediaQuery, Button } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { YearCalendar } from '@mui/x-date-pickers/YearCalendar';
import { MonthCalendar } from '@mui/x-date-pickers/MonthCalendar';
import Swal from 'sweetalert2';

const Transactions = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  
  const { getAuthUser} = useContext(AuthContext);
  const authUser = getAuthUser();
  const navigate = useNavigate();

  const countries = [
    { code: 'AD', label: 'Andorra', phone: '376' },
    {
      code: 'AE',
      label: 'United Arab Emirates',
      phone: '971',
    },
    { code: 'AF', label: 'Afghanistan', phone: '93' },
    {
      code: 'AG',
      label: 'Antigua and Barbuda',
      phone: '1-268',
    },
    { code: 'AI', label: 'Anguilla', phone: '1-264' },
    { code: 'AL', label: 'Albania', phone: '355' },
    { code: 'AM', label: 'Armenia', phone: '374' },
    { code: 'AO', label: 'Angola', phone: '244' },
    { code: 'AQ', label: 'Antarctica', phone: '672' },
    { code: 'AR', label: 'Argentina', phone: '54' },
    { code: 'AS', label: 'American Samoa', phone: '1-684' },
    { code: 'AT', label: 'Austria', phone: '43' },
    {
      code: 'AU',
      label: 'Australia',
      phone: '61',
      suggested: true,
    },
    { code: 'AW', label: 'Aruba', phone: '297' },
    { code: 'AX', label: 'Alland Islands', phone: '358' },
    { code: 'AZ', label: 'Azerbaijan', phone: '994' },
    {
      code: 'BA',
      label: 'Bosnia and Herzegovina',
      phone: '387',
    },
    { code: 'BB', label: 'Barbados', phone: '1-246' },
    { code: 'BD', label: 'Bangladesh', phone: '880' },
    { code: 'BE', label: 'Belgium', phone: '32' },
    { code: 'BF', label: 'Burkina Faso', phone: '226' },
    { code: 'BG', label: 'Bulgaria', phone: '359' },
    { code: 'BH', label: 'Bahrain', phone: '973' },
    { code: 'BI', label: 'Burundi', phone: '257' },
    { code: 'BJ', label: 'Benin', phone: '229' },
    { code: 'BL', label: 'Saint Barthelemy', phone: '590' },
    { code: 'BM', label: 'Bermuda', phone: '1-441' },
    { code: 'BN', label: 'Brunei Darussalam', phone: '673' },
    { code: 'BO', label: 'Bolivia', phone: '591' },
    { code: 'BR', label: 'Brazil', phone: '55' },
    { code: 'BS', label: 'Bahamas', phone: '1-242' },
    { code: 'BT', label: 'Bhutan', phone: '975' },
    { code: 'BV', label: 'Bouvet Island', phone: '47' },
    { code: 'BW', label: 'Botswana', phone: '267' },
    { code: 'BY', label: 'Belarus', phone: '375' },
    { code: 'BZ', label: 'Belize', phone: '501' },
    {
      code: 'CA',
      label: 'Canada',
      phone: '1',
      suggested: true,
    },
    {
      code: 'CC',
      label: 'Cocos (Keeling) Islands',
      phone: '61',
    },
    {
      code: 'CD',
      label: 'Congo, Democratic Republic of the',
      phone: '243',
    },
    {
      code: 'CF',
      label: 'Central African Republic',
      phone: '236',
    },
    {
      code: 'CG',
      label: 'Congo, Republic of the',
      phone: '242',
    },
    { code: 'CH', label: 'Switzerland', phone: '41' },
    { code: 'CI', label: "Cote d'Ivoire", phone: '225' },
    { code: 'CK', label: 'Cook Islands', phone: '682' },
    { code: 'CL', label: 'Chile', phone: '56' },
    { code: 'CM', label: 'Cameroon', phone: '237' },
    { code: 'CN', label: 'China', phone: '86' },
    { code: 'CO', label: 'Colombia', phone: '57' },
    { code: 'CR', label: 'Costa Rica', phone: '506' },
    { code: 'CU', label: 'Cuba', phone: '53' },
    { code: 'CV', label: 'Cape Verde', phone: '238' },
    { code: 'CW', label: 'Curacao', phone: '599' },
    { code: 'CX', label: 'Christmas Island', phone: '61' },
    { code: 'CY', label: 'Cyprus', phone: '357' },
    { code: 'CZ', label: 'Czech Republic', phone: '420' },
    {
      code: 'DE',
      label: 'Germany',
      phone: '49',
      suggested: true,
    },
    { code: 'DJ', label: 'Djibouti', phone: '253' },
    { code: 'DK', label: 'Denmark', phone: '45' },
    { code: 'DM', label: 'Dominica', phone: '1-767' },
    {
      code: 'DO',
      label: 'Dominican Republic',
      phone: '1-809',
    },
    { code: 'DZ', label: 'Algeria', phone: '213' },
    { code: 'EC', label: 'Ecuador', phone: '593' },
    { code: 'EE', label: 'Estonia', phone: '372' },
    { code: 'EG', label: 'Egypt', phone: '20' },
    { code: 'EH', label: 'Western Sahara', phone: '212' },
    { code: 'ER', label: 'Eritrea', phone: '291' },
    { code: 'ES', label: 'Spain', phone: '34' },
    { code: 'ET', label: 'Ethiopia', phone: '251' },
    { code: 'FI', label: 'Finland', phone: '358' },
    { code: 'FJ', label: 'Fiji', phone: '679' },
    {
      code: 'FK',
      label: 'Falkland Islands (Malvinas)',
      phone: '500',
    },
    {
      code: 'FM',
      label: 'Micronesia, Federated States of',
      phone: '691',
    },
    { code: 'FO', label: 'Faroe Islands', phone: '298' },
    {
      code: 'FR',
      label: 'France',
      phone: '33',
      suggested: true,
    },
    { code: 'GA', label: 'Gabon', phone: '241' },
    { code: 'GB', label: 'United Kingdom', phone: '44' },
    { code: 'GD', label: 'Grenada', phone: '1-473' },
    { code: 'GE', label: 'Georgia', phone: '995' },
    { code: 'GF', label: 'French Guiana', phone: '594' },
    { code: 'GG', label: 'Guernsey', phone: '44' },
    { code: 'GH', label: 'Ghana', phone: '233' },
    { code: 'GI', label: 'Gibraltar', phone: '350' },
    { code: 'GL', label: 'Greenland', phone: '299' },
    { code: 'GM', label: 'Gambia', phone: '220' },
    { code: 'GN', label: 'Guinea', phone: '224' },
    { code: 'GP', label: 'Guadeloupe', phone: '590' },
    { code: 'GQ', label: 'Equatorial Guinea', phone: '240' },
    { code: 'GR', label: 'Greece', phone: '30' },
    {
      code: 'GS',
      label: 'South Georgia and the South Sandwich Islands',
      phone: '500',
    },
    { code: 'GT', label: 'Guatemala', phone: '502' },
    { code: 'GU', label: 'Guam', phone: '1-671' },
    { code: 'GW', label: 'Guinea-Bissau', phone: '245' },
    { code: 'GY', label: 'Guyana', phone: '592' },
    { code: 'HK', label: 'Hong Kong', phone: '852' },
    {
      code: 'HM',
      label: 'Heard Island and McDonald Islands',
      phone: '672',
    },
    { code: 'HN', label: 'Honduras', phone: '504' },
    { code: 'HR', label: 'Croatia', phone: '385' },
    { code: 'HT', label: 'Haiti', phone: '509' },
    { code: 'HU', label: 'Hungary', phone: '36' },
    { code: 'ID', label: 'Indonesia', phone: '62' },
    { code: 'IE', label: 'Ireland', phone: '353' },
    { code: 'IL', label: 'Israel', phone: '972' },
    { code: 'IM', label: 'Isle of Man', phone: '44' },
    { code: 'IN', label: 'India', phone: '91' },
    {
      code: 'IO',
      label: 'British Indian Ocean Territory',
      phone: '246',
    },
    { code: 'IQ', label: 'Iraq', phone: '964' },
    {
      code: 'IR',
      label: 'Iran, Islamic Republic of',
      phone: '98',
    },
    { code: 'IS', label: 'Iceland', phone: '354' },
    { code: 'IT', label: 'Italy', phone: '39' },
    { code: 'JE', label: 'Jersey', phone: '44' },
    { code: 'JM', label: 'Jamaica', phone: '1-876' },
    { code: 'JO', label: 'Jordan', phone: '962' },
    {
      code: 'JP',
      label: 'Japan',
      phone: '81',
      suggested: true,
    },
    { code: 'KE', label: 'Kenya', phone: '254' },
    { code: 'KG', label: 'Kyrgyzstan', phone: '996' },
    { code: 'KH', label: 'Cambodia', phone: '855' },
    { code: 'KI', label: 'Kiribati', phone: '686' },
    { code: 'KM', label: 'Comoros', phone: '269' },
    {
      code: 'KN',
      label: 'Saint Kitts and Nevis',
      phone: '1-869',
    },
    {
      code: 'KP',
      label: "Korea, Democratic People's Republic of",
      phone: '850',
    },
    { code: 'KR', label: 'Korea, Republic of', phone: '82' },
    { code: 'KW', label: 'Kuwait', phone: '965' },
    { code: 'KY', label: 'Cayman Islands', phone: '1-345' },
    { code: 'KZ', label: 'Kazakhstan', phone: '7' },
    {
      code: 'LA',
      label: "Lao People's Democratic Republic",
      phone: '856',
    },
    { code: 'LB', label: 'Lebanon', phone: '961' },
    { code: 'LC', label: 'Saint Lucia', phone: '1-758' },
    { code: 'LI', label: 'Liechtenstein', phone: '423' },
    { code: 'LK', label: 'Sri Lanka', phone: '94' },
    { code: 'LR', label: 'Liberia', phone: '231' },
    { code: 'LS', label: 'Lesotho', phone: '266' },
    { code: 'LT', label: 'Lithuania', phone: '370' },
    { code: 'LU', label: 'Luxembourg', phone: '352' },
    { code: 'LV', label: 'Latvia', phone: '371' },
    { code: 'LY', label: 'Libya', phone: '218' },
    { code: 'MA', label: 'Morocco', phone: '212' },
    { code: 'MC', label: 'Monaco', phone: '377' },
    {
      code: 'MD',
      label: 'Moldova, Republic of',
      phone: '373',
    },
    { code: 'ME', label: 'Montenegro', phone: '382' },
    {
      code: 'MF',
      label: 'Saint Martin (French part)',
      phone: '590',
    },
    { code: 'MG', label: 'Madagascar', phone: '261' },
    { code: 'MH', label: 'Marshall Islands', phone: '692' },
    {
      code: 'MK',
      label: 'Macedonia, the Former Yugoslav Republic of',
      phone: '389',
    },
    { code: 'ML', label: 'Mali', phone: '223' },
    { code: 'MM', label: 'Myanmar', phone: '95' },
    { code: 'MN', label: 'Mongolia', phone: '976' },
    { code: 'MO', label: 'Macao', phone: '853' },
    {
      code: 'MP',
      label: 'Northern Mariana Islands',
      phone: '1-670',
    },
    { code: 'MQ', label: 'Martinique', phone: '596' },
    { code: 'MR', label: 'Mauritania', phone: '222' },
    { code: 'MS', label: 'Montserrat', phone: '1-664' },
    { code: 'MT', label: 'Malta', phone: '356' },
    { code: 'MU', label: 'Mauritius', phone: '230' },
    { code: 'MV', label: 'Maldives', phone: '960' },
    { code: 'MW', label: 'Malawi', phone: '265' },
    { code: 'MX', label: 'Mexico', phone: '52' },
    { code: 'MY', label: 'Malaysia', phone: '60' },
    { code: 'MZ', label: 'Mozambique', phone: '258' },
    { code: 'NA', label: 'Namibia', phone: '264' },
    { code: 'NC', label: 'New Caledonia', phone: '687' },
    { code: 'NE', label: 'Niger', phone: '227' },
    { code: 'NF', label: 'Norfolk Island', phone: '672' },
    { code: 'NG', label: 'Nigeria', phone: '234' },
    { code: 'NI', label: 'Nicaragua', phone: '505' },
    { code: 'NL', label: 'Netherlands', phone: '31' },
    { code: 'NO', label: 'Norway', phone: '47' },
    { code: 'NP', label: 'Nepal', phone: '977' },
    { code: 'NR', label: 'Nauru', phone: '674' },
    { code: 'NU', label: 'Niue', phone: '683' },
    { code: 'NZ', label: 'New Zealand', phone: '64' },
    { code: 'OM', label: 'Oman', phone: '968' },
    { code: 'PA', label: 'Panama', phone: '507' },
    { code: 'PE', label: 'Peru', phone: '51' },
    { code: 'PF', label: 'French Polynesia', phone: '689' },
    { code: 'PG', label: 'Papua New Guinea', phone: '675' },
    { code: 'PH', label: 'Philippines', phone: '63' },
    { code: 'PK', label: 'Pakistan', phone: '92' },
    { code: 'PL', label: 'Poland', phone: '48' },
    {
      code: 'PM',
      label: 'Saint Pierre and Miquelon',
      phone: '508',
    },
    { code: 'PN', label: 'Pitcairn', phone: '870' },
    { code: 'PR', label: 'Puerto Rico', phone: '1' },
    {
      code: 'PS',
      label: 'Palestine, State of',
      phone: '970',
    },
    { code: 'PT', label: 'Portugal', phone: '351' },
    { code: 'PW', label: 'Palau', phone: '680' },
    { code: 'PY', label: 'Paraguay', phone: '595' },
    { code: 'QA', label: 'Qatar', phone: '974' },
    { code: 'RE', label: 'Reunion', phone: '262' },
    { code: 'RO', label: 'Romania', phone: '40' },
    { code: 'RS', label: 'Serbia', phone: '381' },
    { code: 'RU', label: 'Russian Federation', phone: '7' },
    { code: 'RW', label: 'Rwanda', phone: '250' },
    { code: 'SA', label: 'Saudi Arabia', phone: '966' },
    { code: 'SB', label: 'Solomon Islands', phone: '677' },
    { code: 'SC', label: 'Seychelles', phone: '248' },
    { code: 'SD', label: 'Sudan', phone: '249' },
    { code: 'SE', label: 'Sweden', phone: '46' },
    { code: 'SG', label: 'Singapore', phone: '65' },
    { code: 'SH', label: 'Saint Helena', phone: '290' },
    { code: 'SI', label: 'Slovenia', phone: '386' },
    {
      code: 'SJ',
      label: 'Svalbard and Jan Mayen',
      phone: '47',
    },
    { code: 'SK', label: 'Slovakia', phone: '421' },
    { code: 'SL', label: 'Sierra Leone', phone: '232' },
    { code: 'SM', label: 'San Marino', phone: '378' },
    { code: 'SN', label: 'Senegal', phone: '221' },
    { code: 'SO', label: 'Somalia', phone: '252' },
    { code: 'SR', label: 'Suriname', phone: '597' },
    { code: 'SS', label: 'South Sudan', phone: '211' },
    {
      code: 'ST',
      label: 'Sao Tome and Principe',
      phone: '239',
    },
    { code: 'SV', label: 'El Salvador', phone: '503' },
    {
      code: 'SX',
      label: 'Sint Maarten (Dutch part)',
      phone: '1-721',
    },
    {
      code: 'SY',
      label: 'Syrian Arab Republic',
      phone: '963',
    },
    { code: 'SZ', label: 'Swaziland', phone: '268' },
    {
      code: 'TC',
      label: 'Turks and Caicos Islands',
      phone: '1-649',
    },
    { code: 'TD', label: 'Chad', phone: '235' },
    {
      code: 'TF',
      label: 'French Southern Territories',
      phone: '262',
    },
    { code: 'TG', label: 'Togo', phone: '228' },
    { code: 'TH', label: 'Thailand', phone: '66' },
    { code: 'TJ', label: 'Tajikistan', phone: '992' },
    { code: 'TK', label: 'Tokelau', phone: '690' },
    { code: 'TL', label: 'Timor-Leste', phone: '670' },
    { code: 'TM', label: 'Turkmenistan', phone: '993' },
    { code: 'TN', label: 'Tunisia', phone: '216' },
    { code: 'TO', label: 'Tonga', phone: '676' },
    { code: 'TR', label: 'Turkey', phone: '90' },
    {
      code: 'TT',
      label: 'Trinidad and Tobago',
      phone: '1-868',
    },
    { code: 'TV', label: 'Tuvalu', phone: '688' },
    {
      code: 'TW',
      label: 'Taiwan, Republic of China',
      phone: '886',
    },
    {
      code: 'TZ',
      label: 'United Republic of Tanzania',
      phone: '255',
    },
    { code: 'UA', label: 'Ukraine', phone: '380' },
    { code: 'UG', label: 'Uganda', phone: '256' },
    {
      code: 'US',
      label: 'United States',
      phone: '1',
      suggested: true,
    },
    { code: 'UY', label: 'Uruguay', phone: '598' },
    { code: 'UZ', label: 'Uzbekistan', phone: '998' },
    {
      code: 'VA',
      label: 'Holy See (Vatican City State)',
      phone: '379',
    },
    {
      code: 'VC',
      label: 'Saint Vincent and the Grenadines',
      phone: '1-784',
    },
    { code: 'VE', label: 'Venezuela', phone: '58' },
    {
      code: 'VG',
      label: 'British Virgin Islands',
      phone: '1-284',
    },
    {
      code: 'VI',
      label: 'US Virgin Islands',
      phone: '1-340',
    },
    { code: 'VN', label: 'Vietnam', phone: '84' },
    { code: 'VU', label: 'Vanuatu', phone: '678' },
    { code: 'WF', label: 'Wallis and Futuna', phone: '681' },
    { code: 'WS', label: 'Samoa', phone: '685' },
    { code: 'XK', label: 'Kosovo', phone: '383' },
    { code: 'YE', label: 'Yemen', phone: '967' },
    { code: 'YT', label: 'Mayotte', phone: '262' },
    { code: 'ZA', label: 'South Africa', phone: '27' },
    { code: 'ZM', label: 'Zambia', phone: '260' },
    { code: 'ZW', label: 'Zimbabwe', phone: '263' },
  ];

  // values to send to backend
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [loading, setLoading] = useState(false);

  const [subMerchant, setSubMerchant] = useState('');
  const [subMerchantError, setSubMerchantError] = useState('');

  const [gatewayMethod, setGatewayMethod] = useState('');
  const [gatewayMethodError, setGatewayMethodError] = useState('');

  const [firstName, setFirstName] = useState('');
  const [firstNameError, setFirstNameError] = useState('');  
  
  const [lastName, setLastName] = useState('');
  const [lastNameError, setLastNameError] = useState('');  
  
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');  
  
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');  
  
  const [state, setState] = useState('');
  const [stateError, setStateError] = useState('');  
  
  const [address, setAddress] = useState('');
  const [addressError, setAddressError] = useState('');  
  
  const [zipCode, setZipCode] = useState('');
  const [zipCodeError, setZipCodeError] = useState('');

  const [city, setCity] = useState('');
  const [cityError, setCityError] = useState('');   
  
  const getDefaultCountry = () => {
    const defaultCountry = countries.find(country => country.code === 'US');
    return defaultCountry || null;
  };

  const [country, setCountry] = useState(getDefaultCountry());
  const [countryError, setCountryError] = useState('');
  
  const [clientIP, setClientIP] = useState('');
  const [clientIPError, setClientIPError] = useState('');  
  
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');
  
  const [currency, setCurrency] = useState('USD');
  const [currencyError, setCurrencyError] = useState('');
  
  const [cardNumber, setCardNumber] = useState('');
  const [cardNumberError, setCardNumberError] = useState('');  
  
  const [cardName, setCardName] = useState('');
  const [cardNameError, setCardNameError] = useState('');  
  
  const [cardType, setCardType] = useState('');
  const [cardTypeError, setCardTypeError] = useState('');  
  
  const [cardExpDate, setCardExpDate] = useState(dayjs());
  const [cardExpDateError, setCardExpDateError] = useState('');  
  
  const [cardCVV, setCardCVV] = useState('');
  const [cardCVVError, setCardCVVError] = useState('');  

  const handleSubmit = (event) => {
    event.preventDefault();
  
    if (!subMerchant) {
      setSubMerchantError('Please select a sub merchant.');
    } else {
      // The sub merchant is valid, you can proceed with submitting the form or perform any other actions.
      setSubMerchantError('');
    }

    if (!gatewayMethod) {
      setGatewayMethodError('Please select a gateway method.');
    } else {
      setGatewayMethodError('');
    }

    if (!firstName) {
      setFirstNameError('Please enter first name.');
    } else {
      setFirstNameError('');
    }

    if (!lastName) {
      setLastNameError('Please enter last name.');
    } else {
      setLastNameError('');
    }

    if (!phone) {
      setPhoneError('Phone number is required.');
    } else if (!/^\d{10}$/.test(phone)) {
      setPhoneError('Enter a valid 10-digit phone number.');
    } else {
      setPhoneError('');
    }

    if (!email) {
      setEmailError('Email is required.');
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError('Enter a valid email address.');
    } else {
      setEmailError('');
    }

    if (!state) {
      setStateError('Please enter state.');
    } else {
      setStateError('');
    }

    if (!address) {
      setAddressError('Please enter address.');
    } else {
      setAddressError('');
    }
    
    const zipCodePattern = /^\d{5}$/;
  
    if (!zipCode.match(zipCodePattern)) {
      setZipCodeError('Please enter a valid ZIP code.');
    } else {
      // The ZIP code is valid, you can proceed with submitting the form or perform any other actions.
      setZipCodeError('');
    }
    
    if (!city) {
      setCityError('Please enter city.');
    } else {
      setCityError('');
    }

    // alert(country); console.log('coutnry', country)
    if (country === null) {
      setCountryError('Please select a country.');
    } else {
      setCountryError('');
    }

    if (clientIP) {
      // Regular expression pattern for IP address validation
      const ipRegexPattern = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
  
      if (!ipRegexPattern.test(clientIP)) {
        setClientIPError('Invalid IP Address format.');
      } else {
        setClientIPError('');
      }
    } else {
      setClientIPError('');
    }

    if (!amount) {
      setAmountError('Amount is required.');
    } else {
      const parsedAmount = parseFloat(amount);
  
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        setAmountError('Invalid Amount.');
      } else {
        setAmountError('');
      }
    }
  
    if (!currency) {
      setCurrencyError('Please select a currency.');
    } else {
      setCurrencyError('');
    }

    // if (!/^\d{16}$/.test(cardNumber)) {
    //   setCardNumberError('Card number must be a 16-digit number.');
    // } else {
    //   setCardNumberError('');
    // }

    // if (!cardName) {
    //   setCardNameError('Please enter name on card.');
    // } else {
    //   setCardNameError('');
    // }

    // if (!cardType) {
    //   setCardTypeError('Please select a card type.');
    // } else {
    //   setCardTypeError('');
    // }

    // console.log('date', cardExpDate, typeof cardExpDate)
    if (cardExpDate === null) {
      setCardExpDateError('Please select a valid date.')
    } else if (cardExpDate.$M === NaN || cardExpDate.$y === NaN) {
      setCardExpDateError('Please select a valid date.')
    } else {
      setCardExpDateError('');
    }

    if (!cardCVV || !/^[0-9]{3,4}$/.test(cardCVV)) {
      setCardCVVError('Please enter a valid CVV code');
    } else {
      setCardCVVError('');
    }

    if (
      // subMerchant &&
      // !subMerchantError && 
      // gatewayMethod &&
      // !gatewayMethodError &&
      firstName && 
      !firstNameError &&
      lastName && 
      !lastNameError && 
      phone &&
      !phoneError && 
      email &&
      !emailError && 
      state &&
      !stateError && 
      address &&
      !addressError &&
      zipCode &&
      !zipCodeError &&
      city &&
      !cityError &&
      country !== null &&
      !countryError &&
      // clientIP &&
      !clientIPError &&
      amount &&
      !amountError &&
      currency &&
      !currencyError &&
      cardNumber &&
      !cardNumberError &&
      // cardName &&
      // !cardNameError &&
      // cardType &&
      // !cardTypeError &&
      cardExpDate !== null &&
      !cardExpDateError &&
      cardCVV &&
      !cardCVVError
    ) {

      const monthString = new Date(0, cardExpDate.$M).toLocaleString('en-US', { month: '2-digit' });
      const cardNumberFilterd = cardNumber.replace(/\s/g, '')
      // alert('Submitting...' + cardNumberFilterd + ' ' + cardNumber + ' ' + monthString);

      const headers = {
        'Content-Type': 'application/json',
        'x-api-key': authUser.apiKey,
      }

      const payload = {
        mid: authUser.name,
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        address: address,
        city: city,
        state: state,
        country: country.code,
        zipcode: zipCode,
        clientIp: clientIP,
        amount: amount,
        currency: currency,
        orderId: "",
        orderDetail: "virtual terminal",
        // cardType: cardType,
        cardNumber: cardNumberFilterd,
        cardCVV: cardCVV,
        cardExpMonth: monthString,
        cardExpYear: cardExpDate.$y,
        redirectUrl: "",
        callbackUrl: "",
      }

      setLoading(true);

      paymentApi.payment().payment2d(headers, payload)
        .then(res => {   
          console.log('vitual terminal res', res.data);
          if (res.data.error) {
            // alert(res.data.error);
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: res.data.error,
              showConfirmButton: true,
            });
          } else {
            // alert(res.data.status + ': ' + res.data.message);
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: res.data.message,
              showConfirmButton: true,
            });
          }          
          setLoading(false); 
        })
        .catch(err => {
          // alert(err.message);
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: err.message,
            showConfirmButton: true,
          });
          setLoading(false);
        });
      
    } else {
      // console.log(cardExpDate);
      // if (country !== null)
      //   alert(country.code);
      // if (cardExpDate !== null)
      //   alert(cardExpDate.$y + ' ' + (cardExpDate.$M + 1));
      // alert('Please check the input values.')
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Please check the input values.',
        showConfirmButton: true,
      });
      return;
    }

  };
  
  const handleSubMerchantChange = (event) => {
    setSubMerchant(event.target.value);
  };

  const handleGatewayMethodChange = (event) => {
    setGatewayMethod(event.target.value);
  };

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleStateChange = (event) => {
    setState(event.target.value);
  };

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handleZipCodeChange = (event) => {
    setZipCode(event.target.value);
  };
  
  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const handleCountryChange = (event, value) => {
    // console.log('countyr', value.code);
    setCountry(value);
  };

  const handleClientIPChange = (event) => {
    setClientIP(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };

  const handleCardNumberChange = (event) => {
    // let inputValue = event.target.value;

    // // Check for non-digit characters using a regular expression
    // if (!/^\d*$/.test(inputValue)) {
    //   setCardNumberError('Card number must only contain digits.');
    // } else {
    //   setCardNumber(inputValue);
    //   setCardNumberError('');
    // }

    let formattedValue = event.target.value;
    // Remove any existing spaces from the input value
    formattedValue = formattedValue.replace(/\s/g, '');
    // Add spaces every 4 characters
    if (formattedValue.length > 0) {
      formattedValue = formattedValue.match(/.{1,4}/g).join(' ');
    }
    setCardNumber(formattedValue);

    // Validate the card number length
    if (formattedValue.replace(/\s/g, '').length === 16) {
      setCardNumberError('');
    } else {
      setCardNumberError('Invalid card number');
    }

  };

  const handleCardNameChange = (event) => {
    setCardName(event.target.value);
  };

  const handleCardTypeChange = (event) => {
    setCardType(event.target.value);
  };

  const handleCardExpDateChange = (date) => {
    if (date === null) {
      setCardExpDateError('Please select a valid date.')
    } else if (date.$M === NaN || date.$y === NaN) {
      setCardExpDateError('Please select a valid date.')
    } else {
      setCardExpDate(date);
      setCardExpDateError('');
    }    
  };

  const handleCardCVVChange = (event) => {
    setCardCVV(event.target.value);
  };

  useEffect(() => {
    if (authUser === null) {
      navigate('/login');
    }
  }, [authUser])

  return (
    <Box m="1.5rem 2.5rem" pb="1.5rem">
      <Header title="Virtual Terminal" subTitle="" />
      {
        loading 
        ?
        "Processing. Please don't take actions until you get the result..."
        :
        <Box
          mt="20px"
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gridAutoRows="60px"
          gap="20px"
          sx={{
            "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
          }}
        >
          {/* <Box
            gridColumn="span 12"
            gridRow="span 2"
            backgroundColor={theme.palette.background.alt}
            p="1rem"
            borderRadius="0.55rem"
          >
            <Header title="" subTitle="SUB MERCHANT DETAILS" />
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-around"
            >
              <Box
                width="100%"
                gridColumn="span 12"
                gridRow="span 1"
                // backgroundColor={theme.palette.background.alt}
                p="1rem"
              >
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Sub Merchant</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={subMerchant}
                    label="Sub Merchant"
                    onChange={handleSubMerchantChange}
                    error={!!subMerchantError}
                    helperText={subMerchantError}
                  >
                    <MenuItem value={1}>Merchant 2D</MenuItem>
                    <MenuItem value={2}>Merchant 3D</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box
                width="100%"
                gridColumn="span 12"
                gridRow="span 1"
                // backgroundColor={theme.palette.background.alt}
                p="1rem"
              >
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Gateway Method</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={gatewayMethod}
                    label="Gateway Method"
                    onChange={handleGatewayMethodChange}
                    error={!!gatewayMethodError}
                    helperText={gatewayMethodError}
                  >
                    <MenuItem value={1}>Bank 01</MenuItem>
                    <MenuItem value={2}>Bank 02</MenuItem>
                    <MenuItem value={3}>Bank 03</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>          
          </Box> */}
          <Box
            gridColumn="span 12"
            gridRow="span 6"
            backgroundColor={theme.palette.background.alt}
            p="1rem"
            borderRadius="0.55rem"
          >
            <Header title="" subTitle="USER DETAILS" />
            <Box
              display="grid"
              gridTemplateColumns="repeat(12, 1fr)"
              gridAutoRows="80px"
            >
              <Box
                width="100%"
                gridColumn="span 6"
                gridRow="span 1"
                // backgroundColor={theme.palette.background.alt}
                p="1rem"
              >
                <TextField
                  required
                  id="firstName"
                  label="First Name"
                  style={{width:"100%"}}
                  defaultValue=""
                  value={firstName}
                  onChange={handleFirstNameChange}
                  error={!!firstNameError}
                  helperText={firstNameError}
                />
              </Box>
              <Box
                width="100%"
                gridColumn="span 6"
                gridRow="span 1"
                // backgroundColor={theme.palette.background.alt}
                p="1rem"
              >
                <TextField
                  required
                  id="lastName"
                  label="Last Name"
                  style={{width:"100%"}}
                  defaultValue=""
                  value={lastName}
                  onChange={handleLastNameChange}
                  error={!!lastNameError}
                  helperText={lastNameError}
                />
              </Box>
              <Box
                width="100%"
                gridColumn="span 6"
                gridRow="span 1"
                // backgroundColor={theme.palette.background.alt}
                p="1rem"
              >
                <TextField
                  required
                  id="phone"
                  label="Phone"
                  style={{width:"100%"}}
                  defaultValue=""
                  value={phone}
                  onChange={handlePhoneChange}
                  error={!!phoneError}
                  helperText={phoneError}
                />
              </Box>
              <Box
                width="100%"
                gridColumn="span 6"
                gridRow="span 1"
                // backgroundColor={theme.palette.background.alt}
                p="1rem"
              >
                <TextField
                  required
                  id="email"
                  label="Email"
                  style={{width:"100%"}}
                  defaultValue=""
                  value={email}
                  onChange={handleEmailChange}
                  error={!!emailError}
                  helperText={emailError}
                />
              </Box>
              <Box
                width="100%"
                gridColumn="span 6"
                gridRow="span 1"
                // backgroundColor={theme.palette.background.alt}
                p="1rem"
              >
                <TextField
                  required
                  id="state"
                  label="State"
                  style={{width:"100%"}}
                  defaultValue=""
                  value={state}
                  onChange={handleStateChange}
                  error={!!stateError}
                  helperText={stateError}
                />
              </Box>
              <Box
                width="100%"
                gridColumn="span 6"
                gridRow="span 1"
                // backgroundColor={theme.palette.background.alt}
                p="1rem"
              >
                <TextField
                  required
                  id="address"
                  label="Address"
                  style={{width:"100%"}}
                  defaultValue=""
                  value={address}
                  onChange={handleAddressChange}
                  error={!!addressError}
                  helperText={addressError}
                />
              </Box>
              <Box
                width="100%"
                gridColumn="span 6"
                gridRow="span 1"
                // backgroundColor={theme.palette.background.alt}
                p="1rem"
              >
                <TextField
                  required
                  id="pincode"
                  label="Zip Code"
                  style={{width:"100%"}}
                  defaultValue=""
                  value={zipCode}
                  onChange={handleZipCodeChange}
                  error={!!zipCodeError}
                  helperText={zipCodeError}
                />
              </Box>
              <Box
                width="100%"
                gridColumn="span 6"
                gridRow="span 1"
                // backgroundColor={theme.palette.background.alt}
                p="1rem"
              >
                <TextField
                  required
                  id="city"
                  label="City"
                  style={{width:"100%"}}
                  defaultValue=""
                  value={city}
                  onChange={handleCityChange}
                  error={!!cityError}
                  helperText={cityError}
                />
              </Box>
              <Box
                width="100%"
                gridColumn="span 6"
                gridRow="span 1"
                // backgroundColor={theme.palette.background.alt}
                p="1rem"
              >
                <Autocomplete
                  id="country-select-demo"
                  sx={{ width: '100%' }}
                  options={countries}
                  autoHighlight
                  getOptionLabel={(option) => option.label}
                  renderOption={(props, option) => (
                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                      <img
                        loading="lazy"
                        width="20"
                        src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                        srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                        alt=""
                      />
                      {option.label} ({option.code}) +{option.phone}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Country*"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: 'new-password', // disable autocomplete and autofill
                      }}                                        
                      error={!!countryError}
                      helperText={countryError}
                    />
                  )}
                  // defaultValue={countries.find((country) => country.code === 'US')}
                  value={country}
                  onChange={handleCountryChange}
                  error={!!countryError}
                  helperText={countryError}
                />
              </Box>
              <Box
                width="100%"
                gridColumn="span 6"
                gridRow="span 1"
                // backgroundColor={theme.palette.background.alt}
                p="1rem"
              >
                <TextField
                  id="clientIP"
                  label="IP Address"
                  style={{width:"100%"}}
                  defaultValue=""
                  value={clientIP}
                  onChange={handleClientIPChange}
                  error={!!clientIPError}
                  helperText={clientIPError}
                />
              </Box>
            </Box>          
          </Box>
          <Box
            gridColumn="span 12"
            gridRow="span 2"
            backgroundColor={theme.palette.background.alt}
            p="1rem"
            borderRadius="0.55rem"
          >
            <Header title="" subTitle="TRANSACTION DETAILS" />
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-around"
            >
              <Box
                width="100%"
                gridColumn="span 12"
                gridRow="span 1"
                // backgroundColor={theme.palette.background.alt}
                p="1rem"
              >
                <TextField
                  required
                  id="amount"
                  label="Amount"
                  style={{width:"100%"}}
                  defaultValue=""
                  value={amount}
                  onChange={handleAmountChange}
                  error={!!amountError}
                  helperText={amountError}
                />
              </Box>
              <Box
                width="100%"
                gridColumn="span 12"
                gridRow="span 1"
                // backgroundColor={theme.palette.background.alt}
                p="1rem"
              >
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Currency*</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    // defaultValue={'USD'}
                    value={currency}
                    label="Currency"
                    onChange={handleCurrencyChange}
                    error={!!currencyError}
                    helperText={currencyError}
                  >
                    <MenuItem value={'USD'}>USD</MenuItem>
                    <MenuItem value={'EUR'}>EUR</MenuItem>
                    <MenuItem value={'GBP'}>GBP</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>          
          </Box>  
          <Box
            gridColumn="span 12"
            gridRow="span 2"
            backgroundColor={theme.palette.background.alt}
            p="1rem"
            borderRadius="0.55rem"
          >
            <Header title="" subTitle="CARD DETAILS" />
            <Box
              display="grid"
              gridTemplateColumns="repeat(12, 1fr)"
              gridAutoRows="80px"
            >
              <Box
                width="100%"
                gridColumn="span 6"
                gridRow="span 1"
                // backgroundColor={theme.palette.background.alt}
                p="1rem"
              >
                <TextField
                  required
                  id="cardNumber"
                  label="Card Number"
                  style={{width:"100%"}}
                  defaultValue=""
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  inputProps={{
                    maxLength: 19,
                  }}
                  error={!!cardNumberError}
                  helperText={cardNumberError}
                />
              </Box>
              {/* <Box
                width="100%"
                gridColumn="span 6"
                gridRow="span 1"
                // backgroundColor={theme.palette.background.alt}
                p="1rem"
              >
                <TextField
                  required
                  id="cardName"
                  label="Card Name"
                  style={{width:"100%"}}
                  defaultValue=""
                  value={cardName}
                  onChange={handleCardNameChange}
                  error={!!cardNameError}
                  helperText={cardNameError}
                />
              </Box>
              <Box
                width="100%"
                gridColumn="span 3"
                gridRow="span 1"
                // backgroundColor={theme.palette.background.alt}
                p="1rem"
              >
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Card Type*</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={cardType}
                    label="Card Type"
                    onChange={handleCardTypeChange}
                    error={!!cardTypeError}
                    helperText={cardTypeError}
                  >
                    <MenuItem value={'VISA'}>VISA</MenuItem>
                    <MenuItem value={'MASTERCARD'}>MASTERCARD</MenuItem>
                  </Select>
                </FormControl>
              </Box> */}
              <Box
                width="100%"
                gridColumn="span 3"
                gridRow="span 1"
                // backgroundColor={theme.palette.background.alt}
                p="1rem"
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker 
                    id="cardExpDate" 
                    label={'Card Expire Date*'} 
                    views={['month', 'year']}
                    format="MM/YYYY"
                    value={cardExpDate}
                    onChange={handleCardExpDateChange}
                    error={!!cardExpDateError}
                    helperText={cardExpDateError} 
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={!!cardExpDateError}
                        helperText={cardExpDateError} 
                      />
                    )}
                    
                  />
                </LocalizationProvider>              
              </Box>
              <Box
                width="100%"
                gridColumn="span 3"
                gridRow="span 1"
                // backgroundColor={theme.palette.background.alt}
                p="1rem"
              >
                <TextField
                  required
                  id="cardCVV"
                  label="Cvv Code"
                  style={{width:"100%"}}
                  defaultValue=""
                  value={cardCVV}
                  onChange={handleCardCVVChange}
                  error={!!cardCVVError}
                  helperText={cardCVVError}
                />
              </Box> 
            </Box>        
          </Box> 
          <Button id="submit" variant="contained" onClick={handleSubmit}>Submit</Button>       
        </Box>
      }
    </Box>
  );
};

export default Transactions;
