<%-- The following 4 lines are ASP.NET directives needed when using SharePoint components --%>

<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~site/_catalogs/masterpage/customapp.master" Language="C#" %>

<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%-- The markup and script in the following Content element will be placed in the <head> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <meta name="WebPartPageExpansion" content="full" />

    <!-- Add your CSS styles to the following file -->
    <link rel="Stylesheet" type="text/css" href="../Content/App.css" />

    <!-- Add your JavaScript to the following file -->
    <script type="text/javascript" src="../Scripts/App.js"></script>
</asp:Content>

<%-- The markup in the following Content element will be placed in the TitleArea of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    JSLink App Field Demo
</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
    
    <div class="body-text">
        <h2 class="ms-webpart-titleText">Using JSLink to customise your site columns</h2>
        <p>
            This is a small sample designed to show how JSLink can be used to customise site columns.
            This approach can be used for SharePoint 2013 Apps, and should also work in Office 365,
            due to only needed client-side code.
        </p>
        <p>
            The example in this solution makes use of the Jquery Token Input control
            (<a href="http://loopj.com/jquery-tokeninput/" target="_blank">found here</a>) to change a Text type
            site column into an autocomplete lookup control.
        </p>
        <p>
            Due to the use of JQuery in this control, the sample also shows how you can change
            the masterpage of the app for the entire app. This allows you to pull in both JQuery
            and the Token Input control globally, so that they can both be used by the JSLink
            javascript file when it is called by the list. If you don't do this, the list references
            the default masterpage file, which then causes a "JQuery undefined" error when
            you try to load the revised views of the site column.
        </p>
        <p>
            Although the sample uses an internal link to perform the lookup, you can use an external
            web service instead, if you prefer.
        </p>
        <p>
            Here's what the edit view looks like:
        </p>
        <img id="imgScreenshot01" alt="The custom lookup column in edit mode" title="The custom lookup column in edit mode" src="../Images/jslinkappfieldscreenshot.png" />
    </div>

    <div>
        <h2 class="ms-webpart-titleText">The Demo Lists</h2>
        <p class="body-text">
            The "Customers" lists is pre-populated with sample data. This is the list used by the lookup column.
        </p>
        <p class="body-text">
            The "Customer Orders" list uses the JSLink property to change the view of the Customer Name field.
            This means it can use the Token Input control to lookup the customer from the "Customers" list.
        </p>
    </div>
    <div class="app-links">
        <a href="../Lists/Customers/">
            <div class="app-link customers-list">
                <div class="box-content"><div class="box-content-text" id="customers-list">Customers List</div></div>
            </div>
        </a>
        <a href="../Lists/Customer Orders/">
            <div class="app-link customer-orders-list">
                <div class="box-content"><div class="box-content-text" id="customer-orders-list">Customer Orders List</div></div>
            </div>
        </a>
    </div>
    <div class="footer ms-textSmall body-text">
        <span class="ms-uppercase">
            Disclaimer
        </span>
        <p>
            This demo app has been created for sample purposes only. It doesn't necessarily implement code best practices,
            and may not work for every scenario.
        </p>
        <span>Current version: 1.0.0</span>
    </div>

</asp:Content>
