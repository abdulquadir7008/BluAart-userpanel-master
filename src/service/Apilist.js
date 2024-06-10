import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


export const Apilist = createApi({
    reducerPath: 'Apilist',
    baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_API_URL }),
    endpoints: (builder) => ({
        getSiteSetting: builder.query({
            query: () => `/GetSiteSettings`,
        }),
        registerAPI: builder.mutation({
            query: (data) => ({
                url: `/Register`,
                method: 'POST',
                body: data,
            }),
        }),
        emailOTPverification: builder.mutation({
            query: (data) => ({
                url: `/VerifyOTP`,
                method: 'POST',
                body: data,
            }),
        }),
        resendRegistrationOTP: builder.mutation({
            query: (data) => ({
                url: `/ResendRegisterVerifyOTP`,
                method: 'POST',
                body: data,
            }),
        }),
        selectRoleRegistration: builder.mutation({
            query: (data) => ({
                url: `/SelectRole`,
                method: 'POST',
                body: data,
            }),
        }),
        getCounties: builder.query({
            query: () => ({
                url: `/GetCountries`,
                method: 'GET',
            }),
        }),
        addressUpdateRegistration: builder.mutation({
            query: (data) => ({
                url: `/UpdateAddress`,
                method: 'POST',
                body: data,
            }),
        }),
        AgreementAccept: builder.mutation({
            query: (data) => ({
                
                url: `/AgreementAcceptance`,
                method: 'POST',
                body: data,
            }),
        }),
        KycRegistration: builder.mutation({
            query: (data) => ({
                
                url: `/UpdateKyc`,
                method: 'POST',
                body: data,
            }),
        }),
        LoginAPI: builder.mutation({
            query: (data) => ({
                url: `/Login`,
                method: 'POST',
                body: data,
            }),
        }),
        ForgotPasswordAPI: builder.mutation({
            query: (data) => ({
                url: `/ForgotPassword`,
                method: 'POST',
                body: data,
            }),
        }),
        ResetPasswordAPI: builder.mutation({
            query: (data) => ({
                url: `/ResetPassword`,
                method: 'POST',
                body: data,
            }),
        }),
        ConnectWalletAPI: builder.mutation({
            query: ({tokenData,data}) => ({                
                headers: {
                    'Authorization': `Bearer ${tokenData}`
                },
                url: `/ConnectWallet`,
                method: 'POST',
                body: data,
            }),
        }),
        CreateCollection: builder.mutation({
            query: (data) => ({
                prepareHeaders: (headers) => {
                    headers.set("Content-Type", "multipart/form-data");
                    return headers;
                },
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`,
                   
                },
                url: `/CreateCollection`,
                method: 'POST',
                body: data,
                formData: true,
            }),
        }),
        getCollection: builder.query({
            query: () => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetCollection`,
                method: 'GET',
            }),
        }),

        updateCollection: builder.mutation({
            query: (data) => ({
                prepareHeaders: (headers) => {
                    headers.set("Content-Type", "multipart/form-data");
                    return headers;
                },
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/UpdateCollection`,
                method: 'POST',
                body: data,
                formData: true,
            }),
        }),
        getCollectionInfo: builder.mutation({
            query: (data) => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetCollectionInfo`,
                method: 'POST',
                body: data,
            }),
        }),
        getStyles: builder.query({
            query: () => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetStyles`,
                method: 'GET',
            }),
        }),
        getMedium: builder.query({
            query: () => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetMedium`,
                method: 'GET',
            }),
        }),
        getMaterials: builder.query({
            query: () => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetMaterials`,
                method: 'GET',
            }),
        }),
        getKeywords: builder.query({
            query: () => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetKeywords`,
                method: 'GET',
            }),
        }),
        getCategory: builder.query({
            query: () => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetCategories`,
                method: 'GET',
            }),
        }),
        CreateItem: builder.mutation({
            query: (data) => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/CreateItem`,
                method: 'POST',
                body: data,
            }),
        }),
        updateItem: builder.mutation({
            query: (data) => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/UpdateItem`,
                method: 'POST',
                body: data,
            }),
        }),
        getCollectionBasedItem: builder.mutation({
            query: (data) => ({
                url: `/GetCollectionBasedArtItem`,
                method: 'POST',
                body: data,
            }),
        }),
        getLandingPage: builder.query({
            query: () => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/LandingPageInfo`,
                method: 'GET',
            }),
        }),
        getRolebasedUsers: builder.mutation({
            query: (data) => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/RoleBasedUsers`,
                method: 'POST',
                body: data,
            }),
        }),
        getAllCollection: builder.mutation({
            query: (data) => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetAllCollection`,
                method: 'POST',
                body: data,
            }),
        }),
        getAllArtItems: builder.mutation({
            query: (data) => ({
                url: `/GetAllItem`,
                method: 'POST',
                body: data,
            }),
        }),
        
        getItemInfo: builder.mutation({
            query: (data) => ({
                url: `/GetArtItemInfo`,
                method: 'POST',
                body: data,
            }),
        }),
        ItemPublish: builder.mutation({
            query: (data) => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/ItemPublish`,
                method: 'POST',
                body: data,
            }),
        }),

        SellItem: builder.mutation({
            query: (data) => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/ItemList`,
                method: 'POST',
                body: data,
            }),
        }),
        AddtoCart: builder.mutation({
            query: (data) => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/AddtoCart`,
                method: 'POST',
                body: data,
            }),
        }),
        getCartItems: builder.mutation({
            query: (data) => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetCartItem`,
                method: 'POST',
                body: data,
            }),
        }),
        purchaseItem: builder.mutation({
            query: (data) => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/PurchaseItem`,
                method: 'POST',
                body: data,
            }),
        }),
        MakeOffer: builder.mutation({
            query: (data) => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/AddOffer`,
                method: 'POST',
                body: data,
            }),
        }),
        OfferlistBasedItem: builder.mutation({
            query: (data) => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/OfferItemBasedList`,
                method: 'POST',
                body: data,
            }),
        }),
        AcceptOffer: builder.mutation({
            query: (data) => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/Offerstatus`,
                method: 'POST',
                body: data,
            }),
        }),
        Removecart: builder.mutation({
            query: (data) => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/RemoveFromCart`,
                method: 'POST',
                body: data,
            }),
        }),
        itemOwnerList: builder.mutation({
            query: (data) => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetItemOwnerListInfo`,
                method: 'POST',
                body: data,
            }),
        }),
        itemHistoryList: builder.mutation({
            query: (data) => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetItemHistoryListInfo`,
                method: 'POST',
                body: data,
            }),
        }),
        AuthorItemlist: builder.query({
            query: () => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetAuthoredItemList`,
                method: 'GET',
            }),
        }),
        OwnedItemlist: builder.query({
            query: () => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetOwnedItemList`,
                method: 'GET',
            }),
        }),
        GetProfileInfo: builder.query({
            query: () => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetProfileInfo`,
                method: 'GET',
            }),
        }),
        GetArtistList: builder.mutation({
            query: (data) => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/RoleBasedUsers`,
                method: 'POST',
                body: data,
            }),
        }),
        GetArtistInfo: builder.mutation({
            query: (data) => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetArtistInfo`,
                method: 'POST',
                body: data,
            }),
        }),
        GoogleRegister: builder.mutation({
            query: (data) => ({
                url: `/GoogleRegister`,
                method: 'POST',
                body: data,
            }),
        }),
        GoogleLogin: builder.mutation({
            query: (data) => ({
                url: `/GoogleLogin`,
                method: 'POST',
                body: data,
            }),
        }),
        FacebookRegister: builder.mutation({
            query: (data) => ({
                url: `/FacebookRegister`,
                method: 'POST',
                body: data,
            }),
        }),
        FacebookLogin: builder.mutation({
            query: (data) => ({
                url: `/FacebookLogin`,
                method: 'POST',
                body: data,
            }),
        }),
        GetArtistCategories: builder.query({
            query: () => ({
                
                url: `/GetArtistCategories`,
                method: 'GET',
            }),
        }),
        CreateArtworkGeneral: builder.mutation({
            query: (data) => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/CreateArtItemGeneral`,
                method: 'POST',
                body: data,
            }),
        }),
        CreateArtworkArtistDetail: builder.mutation({
            query: (data) => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/CreateArtItemArtistDetail`,
                method: 'POST',
                body: data,
            }),
        }),
        CreateArtworkPriceDetail: builder.mutation({
            query: (data) => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/CreateArtItemPriceDetail`,
                method: 'POST',
                body: data,
            }),
        }),
        CreateArtworkLogisticDetail: builder.mutation({
            query: (data) => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/CreateArtItemLogisticDetail`,
                method: 'POST',
                body: data,
            }),
        }),
        CreateArtworkImageDetail: builder.mutation({
            query: (data) => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/CreateArtItemImageDetail`,
                method: 'POST',
                body: data,
            }),
        }),
        GetAllPhysicalArt: builder.mutation({
            query: (data) => ({                
                url: `/GetAllPhysicalArt`,
                method: 'POST',
                body: data,
            }),
        }),
        SellNFT: builder.mutation({
            query: (data) => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/SellArtNFT`,
                method: 'POST',
                body: data,
            }),
        }),
        AddBid: builder.mutation({
            query: (data) => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/AddBid`,
                method: 'POST',
                body: data,
            }),
        }),
        GetAllAuctionItem: builder.query({
            query: () => ({
                url: `/GetAllAuctionItem`,
                method: 'GET',
            }),
        }),
        GetUserRoleInfo: builder.mutation({
            query: (data) => ({
                url: `/GetUserRoleInfo`,
                method: 'POST',
                body: data,
            }),
        }),
        AddEditBio: builder.mutation({
            query: (data) => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/AddEditBio`,
                method: 'POST',
                body: data,
            }),
        }),
        GetBio: builder.query({
            query: () => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetBio`,
                method: 'GET',
            }),
        }),
        CommonImageUpload: builder.mutation({
            query: (imageData) => ({
                url: '/CommonImageUpload',
                method: 'POST',
                prepareHeaders: (headers) => {
                    headers.set("Content-Type", "multipart/form-data");
                    return headers;
                },
                headers: {                  
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                body: imageData,
                formData: true,
            }),
        }),
        AddExhibition: builder.mutation({
            query: (data) => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/AddExhibition`,
                method: 'POST',
                body: data,
            }),
        }),
        GetExhibitions: builder.query({
            query: () => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetExhibitions`,
                method: 'GET',
            }),
        }),
        DeleteExhibition: builder.mutation({
            query: (data) => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/DeleteExhibition`,
                method: 'POST',
                body: data,
            }),
        }),
        GetOneExhibition: builder.mutation({
            query: (data) => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetOneExhibition`,
                method: 'POST',
                body: data,
            }),
        }),
        EditExhibition: builder.mutation({
            query: (data) => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/EditExhibition`,
                method: 'POST',
                body: data,
            }),
        }),
        AddMediaPublications: builder.mutation({
            query: (data) => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/AddMediaPublications`,
                method: 'POST',
                body: data,
            }),
        }),
        GetMediaPublications: builder.query({
            query: () => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetMediaPublications`,
                method: 'GET',
            }),
        }),
        DeleteMediaPublications: builder.mutation({
            query: (data) => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/DeleteMediaPublications`,
                method: 'POST',
                body: data,
            }),
        }),
        EditMediaPublications: builder.mutation({
            query: (data) => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/EditMediaPublications`,
                method: 'POST',
                body: data,
            }),
        }),
        AddTestimonial: builder.mutation({
            query: (data) => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/AddTestimonial`,
                method: 'POST',
                body: data,
            }),
        }),
        EditTestimonial: builder.mutation({
            query: (data) => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/EditTestimonial`,
                method: 'POST',
                body: data,
            }),
        }),
        GetTestimonials: builder.query({
            query: () => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetTestimonials`,
                method: 'GET',
            }),
        }),
        DeleteTestimonial: builder.mutation({
            query: (data) => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/DeleteTestimonial`,
                method: 'POST',
                body: data,
            }),
        }),
        GetNewsList: builder.query({
            query: () => ({
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetNewsList`,
                method: 'GET',
            }),
        }),
        GetNFTBlockchainInfoList: builder.query({
            query: () => ({
                headers: {
                    'Authorization' : `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetNFTBlockchainInfoList`,
                method: 'GET',
            }),
        }),
        GetItemDetailedInfo: builder.mutation({
            query: (data) => ({
                headers: {
                    'Authorization' : `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetItemDetailedInfo`,
                method: 'POST',
                body: data,
            }),
        }),
        BulkUpload: builder.mutation({
            query: (imageData) => ({
                url: '/BulkUpload',
                method: 'POST',
                prepareHeaders: (headers) => {
                    headers.set("Content-Type", "multipart/form-data");
                    return headers;
                },
                headers: {                  
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                body: imageData,
                formData: true,
            }),
        }),
        GetMediaLimitInfo: builder.mutation({
            query: (data) => ({
                headers: {
                    'Authorization' : `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetMediaLimitInfo`,
                method: 'POST',
                body: data,
            }),
        }),
        GetArtProductCategories: builder.query({
            query: () => ({
                headers: {
                    'Authorization' : `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetArtProductCategories`,
                method: 'GET',
            }),
        }),
        GetFurnishingName: builder.query({
            query: () => ({
                headers: {
                    'Authorization' : `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetFurnishingName`,
                method: 'GET',
            }),
        }),
        GetFurnitureName: builder.query({
            query: () => ({
                headers: {
                    'Authorization' : `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetFurnitureName`,
                method: 'GET',
            }),
        }),
        GetArtProductStyles: builder.query({
            query: () => ({
                headers: {
                    'Authorization' : `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetArtProductStyles`,
                method: 'GET',
            }),
        }),
        GetArtProductBrand: builder.query({
            query: () => ({
                headers: {
                    'Authorization' : `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetArtProductBrand`,
                method: 'GET',
            }),
        }),
        GetArtProductMaterial: builder.query({
            query: () => ({
                headers: {
                    'Authorization' : `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetArtProductMaterial`,
                method: 'GET',
            }),
        }),
        GetArtProductFabric: builder.query({
            query: () => ({
                headers: {
                    'Authorization' : `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetArtProductFabric`,
                method: 'GET',
            }),
        }),
        GetArtProductType: builder.query({
            query: () => ({
                headers: {
                    'Authorization' : `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetArtProductType`,
                method: 'GET',
            }),
        }),
        GetArtProductShape: builder.query({
            query: () => ({
                headers: {
                    'Authorization' : `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetArtProductShape`,
                method: 'GET',
            }),
        }),
        GetArtProductTechnique: builder.query({
            query: () => ({
                headers: {
                    'Authorization' : `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetArtProductTechnique`,
                method: 'GET',
            }),
        }),
        GetCushionSize: builder.query({
            query: () => ({
                headers: {
                    'Authorization' : `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetCushionSize`,
                method: 'GET',
            }),
        }),
        GetRugSize: builder.query({
            query: () => ({
                headers: {
                    'Authorization' : `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetRugSize`,
                method: 'GET',
            }),
        }),
        GetFurnitureName: builder.mutation({
            query: (data) => ({
                headers: {
                    'Authorization' : `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetFurnitureName`,
                method: 'POST',
                body: data,
            }),
        }),
        GetLightingName: builder.mutation({
            query: (data) => ({
                headers: {
                    'Authorization' : `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetLightingName`,
                method: 'POST',
                body: data,
            }),
        }),
        GetFurnishingName: builder.mutation({
            query: (data) => ({
                headers: {
                    'Authorization' : `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetFurnishingName`,
                method: 'POST',
                body: data,
            }),
        }),
        AddAddress: builder.mutation({
            query: (data) => ({
                headers: {
                    'Authorization' : `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/AddAddress`,
                method: 'POST',
                body: data,
            }),
        }),
        GetAddressList: builder.query({
            query: () => ({
                headers: {
                    'Authorization' : `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetAddressList`,
                method: 'GET',
            }),
        }),
        GetOneAddress: builder.mutation({
            query: (data) => ({
                headers: {
                    'Authorization' : `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetOneAddress`,
                method: 'POST',
                body: data,
            }),
        }),
        EditAddress: builder.mutation({
            query: (data) => ({
                headers: {
                    'Authorization' : `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/EditAddress`,
                method: 'POST',
                body: data,
            }),
        }),
        DeleteAddress: builder.mutation({
            query: (data) => ({
                headers: {
                    'Authorization' : `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/DeleteAddress`,
                method: 'POST',
                body: data,
            }),
        }),
        GetPageInfo: builder.mutation({
            query: (data) => ({
                headers: {
                    'Authorization' : `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetPageInfo`,
                method: 'POST',
                body: data,
            }),
        }),
        GetArtistMedium: builder.query({
            query: () => ({
                headers: {
                    'Authorization' : `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetArtistMedium`,
                method: 'GET',
            }),
        }),       
        GetNewsInfo: builder.mutation({
            query: (data) => ({
                headers: {
                    'Authorization' : `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetNewsInfo`,
                method: 'POST',
                body: data,
            }),
        }),
        UpcomingBids: builder.query({
            query: () => ({                
                url: `/UpcomingBids`,
                method: 'GET',
            }),
        }),
        OnGoingBids: builder.query({
            query: () => ({                
                url: `/OnGoingBids`,
                method: 'GET',
            }),
        }),
        ArtistBasedBids: builder.mutation({
            query: (data) => ({                
                url: `/ArtistBasedBids`,
                method: 'POST',
                body: data,
            }),
        }),
        BidInterest: builder.mutation({
            query: (data) => ({                
                url: `/BidInterest`,
                method: 'POST',
                body: data,
            }),
        }),
        ArtistBasedBidInterest: builder.mutation({
            query: (data) => ({                
                url: `/ArtistBasedBidInterest`,
                method: 'POST',
                body: data,
            }),
        }),
        GetCartItemInfo: builder.mutation({
            query: (data) => ({                
                headers: {
                    'Authorization' : `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetCartItemInfo`,
                method: 'POST',
                body: data,
            }),
        }),
        GetCSVSamples: builder.mutation({
            query: (data) => ({                
                headers: {
                    'Authorization' : `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetCSVSamples`,
                method: 'POST',
                body: data,
            }),
        }),
        GetCollectionBasedMintedItem: builder.mutation({
            query: (data) => ({                
                headers: {
                    'Authorization' : `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetCollectionBasedMintedItem`,
                method: 'POST',
                body: data,
            }),
        }),
        GetArtistLabels: builder.query({
            query: () => ({                
                url: `/GetArtistLabels`,
                method: 'GET',
            }),
        }),
        PastBids: builder.query({
            query: () => ({                
                url: `/PastBids`,
                method: 'GET',
            }),
        }),
        DelistArtNFT: builder.mutation({
            query: (data) => ({                
                headers: {
                    'Authorization' : `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/DelistArtNFT`,
                method: 'POST',
                body: data,
            }),
        }),
        HideArtNFT: builder.mutation({
            query: (data) => ({                
                headers: {
                    'Authorization' : `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/HideArtNFT`,
                method: 'POST',
                body: data,
            }),
        }),
        AddPreOffer: builder.mutation({
            query: (data) => ({                
                headers: {
                    'Authorization' : `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/AddPreOffer`,
                method: 'POST',
                body: data,
            }),
        }),
        EnableDisable2FA: builder.mutation({
            query: (data) => ({                
                headers: {
                    'Authorization' : `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/EnableDisable2FA`,
                method: 'POST',
                body: data,
            }),
        }),
        VerifyLogin2FA: builder.mutation({
            query: (data) => ({                
                headers: {
                    'Authorization' : `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/VerifyLogin2FA`,
                method: 'POST',
                body: data,
            }),
        }),
        GetBannerDetails: builder.query({
            query: () => ({                
                url: `/GetBannerDetails`,
                method: 'GET',
            }),
        }),
        GetInnerBannerDetails: builder.query({
            query: () => ({                
                url: `/GetInnerBannerDetails`,
                method: 'GET',
            }),
        }),
        GetUserBasedCollection: builder.mutation({
            query: (data) => ({                
                headers: {
                    'Authorization' : `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetUserBasedCollection`,
                method: 'POST',
                body: data,
            }),
        }),
        ArtistLabelBasedUsers: builder.mutation({
            query: (data) => ({                
                headers: {
                    'Authorization' : `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/ArtistLabelBasedUsers`,
                method: 'POST',
                body: data,
            }),
        }),
        GetMetamaskVideo: builder.query({
            query: () => ({                
                url: `/GetMetamaskVideo`,
                method: 'GET',
            }),
        }),
        AboutusPageInfo: builder.query({
            query: () => ({                
                url: `/AboutusPageInfo`,
                method: 'GET',
            }),
        }),
        FeaturesPageInfo: builder.query({
            query: () => ({                
                url: `/FeaturesPageInfo`,
                method: 'GET',
            }),
        }),
        EventsPageInfo: builder.query({
            query: () => ({                
                url: `/EventsPageInfo`,
                method: 'GET',
            }),
        }),
        Notifications: builder.mutation({
            query: (data) => ({                
                headers: {
                    'Authorization' : `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/Notifications`,
                method: 'POST',
                body: data,
            }),
        }),
        CheckBid: builder.mutation({
            query: (data) => ({                
                headers: {
                    'Authorization' : `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/CheckBid`,
                method: 'POST',
                body: data,
            }),
        }),
        GiftNftList: builder.query({
            query: () => ({
                headers: {
                    'Authorization' : `Bearer ${sessionStorage.getItem("wallettoken")}`
                },                
                url: `/GiftNftList`,
                method: 'GET',
            }),
        }),
        GetGiftItemInfo: builder.mutation({
            query: (data) => ({                
                headers: {
                    'Authorization' : `Bearer ${sessionStorage.getItem("wallettoken")}`
                },
                url: `/GetGiftItemInfo`,
                method: 'POST',
                body: data,
            }),
        }),
    }),
})

export const {
    useGetSiteSettingQuery,
    useRegisterAPIMutation,
    useEmailOTPverificationMutation,
    useResendRegistrationOTPMutation,
    useSelectRoleRegistrationMutation,
    useGetCountiesQuery,
    useAddressUpdateRegistrationMutation,
    useKycRegistrationMutation,
    useLoginAPIMutation,
    useCreateCollectionMutation,
    useGetCollectionQuery,
    useConnectWalletAPIMutation,
    useAgreementAcceptMutation,
    useUpdateCollectionMutation,
    useGetCollectionInfoMutation,
    useForgotPasswordAPIMutation,
    useResetPasswordAPIMutation,
    useGetStylesQuery,
    useGetMediumQuery,
    useGetMaterialsQuery,
    useCreateItemMutation,
    useGetCategoryQuery,
    useGetCollectionBasedItemMutation,
    useGetLandingPageQuery,
    useGetRolebasedUsersMutation,   
    useGetAllArtItemsMutation,
    useGetItemInfoMutation,
    useItemPublishMutation,
    useUpdateItemMutation,
    useSellItemMutation,
    useAddtoCartMutation,
    useGetCartItemsMutation,
    usePurchaseItemMutation,
    useMakeOfferMutation,
    useOfferlistBasedItemMutation,
    useAcceptOfferMutation,
    useRemovecartMutation,
    useItemOwnerListMutation,
    useItemHistoryListMutation,
    useAuthorItemlistQuery,
    useOwnedItemlistQuery,
    useGetProfileInfoQuery,
    useGetArtistListMutation,
    useGetArtistInfoMutation,
    useGoogleRegisterMutation,
    useFacebookRegisterMutation,
    useFacebookLoginMutation,
    useGoogleLoginMutation,
    useGetArtistCategoriesQuery,
    useCreateArtworkGeneralMutation,
    useCreateArtworkArtistDetailMutation,
    useCreateArtworkPriceDetailMutation,
    useCreateArtworkLogisticDetailMutation,
    useCreateArtworkImageDetailMutation,
    useGetKeywordsQuery,
    useGetAllPhysicalArtMutation,
    useSellNFTMutation,
    useAddBidMutation,
    useGetAllAuctionItemQuery,
    useGetUserRoleInfoMutation,
    useAddEditBioMutation,
    useGetBioQuery,
    useCommonImageUploadMutation,
    useAddExhibitionMutation,
    useGetExhibitionsQuery,
    useDeleteExhibitionMutation,
    useGetOneExhibitionMutation,
    useEditExhibitionMutation,
    useAddMediaPublicationsMutation,
    useGetMediaPublicationsQuery,
    useDeleteMediaPublicationsMutation,
    useEditMediaPublicationsMutation,
    useAddTestimonialMutation,
    useEditTestimonialMutation,
    useDeleteTestimonialMutation,
    useGetTestimonialsQuery,
    useGetNewsListQuery,
    useGetNFTBlockchainInfoListQuery,
    useGetItemDetailedInfoMutation,
    useBulkUploadMutation,
    useGetMediaLimitInfoMutation,
    useGetArtProductCategoriesQuery,
    useGetFurnishingNameMutation,
    useGetFurnitureNameMutation,
    useGetArtProductStylesQuery,
    useGetArtProductBrandQuery,
    useGetArtProductMaterialQuery,
    useGetArtProductFabricQuery,
    useGetArtProductShapeQuery,
    useGetArtProductTechniqueQuery,
    useGetArtProductTypeQuery,
    useGetCushionSizeQuery,
    useGetRugSizeQuery,
    useGetLightingNameMutation,
    useAddAddressMutation,
    useGetAddressListQuery,
    useGetOneAddressMutation,
    useEditAddressMutation,
    useDeleteAddressMutation,
    useGetPageInfoMutation,
    useGetArtistMediumQuery,
    useGetNewsInfoMutation,
    useUpcomingBidsQuery,
    useOnGoingBidsQuery,
    useArtistBasedBidsMutation,
    useBidInterestMutation,
    useArtistBasedBidInterestMutation,
    useGetCartItemInfoMutation,
    useGetCSVSamplesMutation,
    useGetCollectionBasedMintedItemMutation,
    useGetAllCollectionMutation,
    useGetArtistLabelsQuery,
    usePastBidsQuery,
    useDelistArtNFTMutation,
    useHideArtNFTMutation,
    useAddPreOfferMutation,
    useEnableDisable2FAMutation,
    useVerifyLogin2FAMutation,
    useGetBannerDetailsQuery,
    useGetInnerBannerDetailsQuery,
    useGetUserBasedCollectionMutation,
    useGetMetamaskVideoQuery,
    useArtistLabelBasedUsersMutation,
    useAboutusPageInfoQuery,
    useEventsPageInfoQuery,
    useFeaturesPageInfoQuery,
    useNotificationsMutation,
    useCheckBidMutation,
    useGiftNftListQuery,
    useGetGiftItemInfoMutation
} = Apilist

