export const PHARMACY_SQL_2008 = `-- =============================================
-- Legacy SQL Server 2008 R2 Schema
-- ProCare Pharmacy Management & Dispensing System
-- Deprecated types: IMAGE, TEXT, NTEXT, DATETIME, MONEY
-- =============================================

CREATE TABLE Patients (
    PatientID INT IDENTITY(1,1) NOT NULL,
    SSN VARCHAR(11) NULL,
    FullName NVARCHAR(150) NOT NULL,
    DateOfBirth DATETIME NOT NULL,
    PhoneNumber VARCHAR(20) NULL,
    InsurancePhoto IMAGE NULL,               -- Deprecated: Legacy SQL 2008 binary blob
    MedicalHistory TEXT NULL,                 -- Deprecated: Replaced by VARCHAR(MAX)
    EmergencyContactNotes NTEXT NULL,         -- Deprecated: Replaced by NVARCHAR(MAX)
    IsActive BIT DEFAULT 1,
    CreatedDate DATETIME DEFAULT GETDATE(),  -- Deprecated: 3.33ms rounding precision
    CONSTRAINT PK_Patients PRIMARY KEY CLUSTERED (PatientID)
);

CREATE TABLE Prescriptions (
    RxNumber INT IDENTITY(100001, 1) NOT NULL,
    PatientID INT NOT NULL,
    DoctorLicenseNumber VARCHAR(50) NOT NULL,
    DoctorName NVARCHAR(100) NOT NULL,
    DrugCode VARCHAR(25) NOT NULL,
    Quantity INT NOT NULL,
    RefillsRemaining SMALLINT NOT NULL DEFAULT 0,
    CopayAmount MONEY NOT NULL,               -- Deprecated: Currency rounding errors
    SpecialInstructions NTEXT NULL,           -- Deprecated: Large text blob
    PrescribedDate DATETIME NOT NULL,
    Status VARCHAR(25) NOT NULL DEFAULT 'PENDING',
    CONSTRAINT PK_Prescriptions PRIMARY KEY CLUSTERED (RxNumber),
    CONSTRAINT FK_Prescriptions_Patients FOREIGN KEY (PatientID) 
        REFERENCES Patients(PatientID)
);

CREATE TABLE PharmacyInventory (
    ItemID INT IDENTITY(1,1) NOT NULL,
    NDCNumber VARCHAR(20) NOT NULL UNIQUE,
    BrandName NVARCHAR(100) NOT NULL,
    GenericName NVARCHAR(100) NOT NULL,
    PackageSize INT NOT NULL,
    UnitCost MONEY NOT NULL,                  -- Deprecated: MONEY rounding hazard
    RetailPrice MONEY NOT NULL,
    StockOnHand INT NOT NULL DEFAULT 0,
    ReorderThreshold INT NOT NULL DEFAULT 20,
    PackageLabelPhoto IMAGE NULL,             -- Deprecated: Bloating DB file size
    LastRestocked DATETIME NULL,
    CONSTRAINT PK_PharmacyInventory PRIMARY KEY CLUSTERED (ItemID)
);

CREATE TABLE DispenseLog (
    DispenseID BIGINT IDENTITY(1,1) NOT NULL,
    RxNumber INT NOT NULL,
    PharmacistID INT NOT NULL,
    DispensedDate DATETIME DEFAULT GETDATE(),
    BatchLotNumber VARCHAR(50) NOT NULL,
    AuditRemarks TEXT NULL,                   -- Deprecated: Legacy unstructured text
    PatientSignatureBlob IMAGE NULL,          -- Deprecated: Raw signature scan
    CONSTRAINT PK_DispenseLog PRIMARY KEY CLUSTERED (DispenseID),
    CONSTRAINT FK_DispenseLog_Prescriptions FOREIGN KEY (RxNumber) 
        REFERENCES Prescriptions(RxNumber)
);
`;

export const ECOMMERCE_SQL_2008 = `-- =============================================
-- Legacy SQL Server 2008 Schema
-- Global Retail & Order Processing System
-- =============================================

CREATE TABLE tbl_Customers (
    CustomerID INT IDENTITY(1,1) NOT NULL,
    CustomerCode VARCHAR(20) NOT NULL UNIQUE,
    CompanyName NVARCHAR(120) NOT NULL,
    ContactName NVARCHAR(80) NULL,
    BillingAddress TEXT NULL,
    CreditLimit MONEY DEFAULT 1000.00,
    ProfileAvatar IMAGE NULL,
    RegistrationDate DATETIME DEFAULT GETDATE(),
    IsVerified BIT DEFAULT 0,
    CONSTRAINT PK_Customers PRIMARY KEY CLUSTERED (CustomerID)
);

CREATE TABLE tbl_Orders (
    OrderID INT IDENTITY(50000, 1) NOT NULL,
    CustomerID INT NOT NULL,
    OrderDate DATETIME NOT NULL,
    RequiredDate DATETIME NULL,
    ShippedDate DATETIME NULL,
    FreightCharge MONEY DEFAULT 0.00,
    InternalFulfillmentNotes NTEXT NULL,
    OrderStatus VARCHAR(30) DEFAULT 'NEW',
    CONSTRAINT PK_Orders PRIMARY KEY CLUSTERED (OrderID),
    CONSTRAINT FK_Orders_Customers FOREIGN KEY (CustomerID) 
        REFERENCES tbl_Customers(CustomerID)
);

CREATE TABLE tbl_OrderItems (
    OrderItemID BIGINT IDENTITY(1,1) NOT NULL,
    OrderID INT NOT NULL,
    ProductID INT NOT NULL,
    UnitPrice MONEY NOT NULL,
    Quantity SMALLINT NOT NULL,
    DiscountPercent REAL DEFAULT 0.0,
    LineTotal MONEY NOT NULL,
    CONSTRAINT PK_OrderItems PRIMARY KEY CLUSTERED (OrderItemID),
    CONSTRAINT FK_OrderItems_Orders FOREIGN KEY (OrderID) 
        REFERENCES tbl_Orders(OrderID)
);
`;

export const ESTOCK_PHARMACY_SQL_2008 = `-- =============================================
-- eStock Pharmacy Management Database (stock_phy_ver1.8.0.0)
-- 8 Modules: Products, Product_Amount, Sales_header, Sales_details,
-- Purchase_header, Customer, Vendor, Employee (53k+ products, 95k+ sales)
-- =============================================

CREATE TABLE Products (
    product_id DECIMAL(18, 0) NOT NULL,
    product_code VARCHAR(50) NOT NULL,
    product_fast_code VARCHAR(20) NULL,
    product_name_ar VARCHAR(100) NOT NULL,
    product_name_en VARCHAR(100) NULL,
    product_scientific_name NVARCHAR(200) NULL,
    product_drug CHAR(1) DEFAULT 'N',
    company_id DECIMAL(18, 0) NULL,
    product_has_expire CHAR(1) DEFAULT 'Y',
    sell_price MONEY NOT NULL,
    buy_price MONEY NOT NULL,
    tax_price MONEY DEFAULT 0.00,
    unit2_sell_price MONEY DEFAULT 0.00,
    unit3_sell_price MONEY DEFAULT 0.00,
    sell_clause MONEY DEFAULT 0.00,
    product_unit1 DECIMAL(18, 0) NULL,
    product_unit2 DECIMAL(18, 0) NULL,
    product_unit3 DECIMAL(18, 0) NULL,
    product_buy_number DECIMAL(18, 2) DEFAULT 1.0,
    group_id DECIMAL(18, 0) NULL,
    deleted CHAR(1) DEFAULT 'N',
    active CHAR(1) DEFAULT 'Y',
    amount_zero CHAR(1) DEFAULT 'N',
    product_image IMAGE NULL,
    CONSTRAINT PK_Products PRIMARY KEY CLUSTERED (product_id)
);

CREATE TABLE Product_Amount (
    pa_id DECIMAL(18, 0) NOT NULL,
    product_id DECIMAL(18, 0) NOT NULL,
    store_id DECIMAL(18, 0) NOT NULL,
    counter_id DECIMAL(18, 0) NOT NULL,
    vendor_id DECIMAL(18, 0) NULL,
    amount DECIMAL(18, 3) NOT NULL DEFAULT 0,
    buy_price MONEY NOT NULL,
    sell_price MONEY NOT NULL,
    tax_price MONEY DEFAULT 0.00,
    exp_date DATETIME NOT NULL,
    Product_update CHAR(1) DEFAULT 'N',
    CONSTRAINT PK_Product_Amount PRIMARY KEY CLUSTERED (pa_id)
);

CREATE TABLE Sales_header (
    sales_id DECIMAL(18, 0) NOT NULL,
    store_id DECIMAL(18, 0) NOT NULL,
    customer_id DECIMAL(18, 0) NOT NULL DEFAULT 0,
    bill_date DATETIME NULL,
    total_bill MONEY NOT NULL,
    total_bill_net MONEY NOT NULL,
    bill_cash MONEY DEFAULT 0.00,
    money_change MONEY DEFAULT 0.00,
    network_id DECIMAL(18, 0) DEFAULT 0,
    network_money MONEY DEFAULT 0.00,
    cashier_id VARCHAR(50) NOT NULL,
    total_disc_per DECIMAL(5, 2) DEFAULT 0.0,
    total_disc_money MONEY DEFAULT 0.00,
    customer_disc_per DECIMAL(5, 2) DEFAULT 0.0,
    sale_class INT DEFAULT 1,
    back CHAR(1) DEFAULT 'N',
    delivery_man_id DECIMAL(18, 0) NULL,
    insert_date DATETIME DEFAULT GETDATE(),
    CONSTRAINT PK_Sales_header PRIMARY KEY CLUSTERED (sales_id)
);

CREATE TABLE Sales_details (
    details_id DECIMAL(18, 0) NOT NULL,
    sales_id DECIMAL(18, 0) NOT NULL,
    product_id DECIMAL(18, 0) NOT NULL,
    counter_id DECIMAL(18, 0) NOT NULL,
    exp_date DATETIME NOT NULL,
    amount FLOAT NOT NULL,
    sell_price MONEY NOT NULL,
    buy_price MONEY NOT NULL,
    disc_money MONEY DEFAULT 0.00,
    disc_per DECIMAL(5, 2) DEFAULT 0.0,
    total_sell MONEY NOT NULL,
    back CHAR(1) DEFAULT 'N',
    back_amount FLOAT DEFAULT 0.0,
    back_price MONEY DEFAULT 0.00,
    sale_unit_change DECIMAL(18, 2) DEFAULT 1.0,
    CONSTRAINT PK_Sales_details PRIMARY KEY CLUSTERED (details_id)
);

CREATE TABLE Purchase_header (
    purchase_id DECIMAL(18, 0) NOT NULL,
    vendor_id DECIMAL(18, 0) NOT NULL,
    store_id DECIMAL(18, 0) NOT NULL,
    bill_date DATETIME NOT NULL,
    bill_number VARCHAR(50) NULL,
    total_bill MONEY NOT NULL,
    bill_disc_per FLOAT DEFAULT 0.0,
    bill_disc_money MONEY DEFAULT 0.00,
    bill_tax MONEY DEFAULT 0.00,
    bill_other_expenses MONEY DEFAULT 0.00,
    back CHAR(1) DEFAULT 'N',
    total_back MONEY DEFAULT 0.00,
    CONSTRAINT PK_Purchase_header PRIMARY KEY CLUSTERED (purchase_id)
);

CREATE TABLE Customer (
    customer_id DECIMAL(18, 0) NOT NULL,
    customer_name_ar VARCHAR(100) NOT NULL,
    customer_name_en VARCHAR(100) NULL,
    mobile VARCHAR(20) NULL,
    customer_class_id DECIMAL(18, 0) DEFAULT 1,
    customer_max_money MONEY DEFAULT 0.00,
    customer_current_money MONEY DEFAULT 0.00,
    customer_start_money MONEY DEFAULT 0.00,
    customer_disc_local FLOAT DEFAULT 0.0,
    customer_disc_import FLOAT DEFAULT 0.0,
    area_id DECIMAL(18, 0) NULL,
    sales_man DECIMAL(18, 0) NULL,
    sale_class_id DECIMAL(18, 0) DEFAULT 1,
    active CHAR(1) DEFAULT 'Y',
    deleted CHAR(1) DEFAULT 'N',
    CONSTRAINT PK_Customer PRIMARY KEY CLUSTERED (customer_id)
);

CREATE TABLE Employee (
    emp_id DECIMAL(18, 0) NOT NULL,
    emp_name_ar VARCHAR(100) NOT NULL,
    emp_name_en VARCHAR(100) NULL,
    job_id DECIMAL(18, 0) NULL,
    basic_salary MONEY DEFAULT 0.00,
    username VARCHAR(50) NOT NULL,
    pass VARCHAR(100) NOT NULL,
    max_disc_per DECIMAL(5, 2) DEFAULT 0.0,
    max_disc_money MONEY DEFAULT 0.00,
    show_buy CHAR(1) DEFAULT 'N',
    emp_add_product CHAR(1) DEFAULT 'N',
    emp_edit_product CHAR(1) DEFAULT 'N',
    emp_edit_sell_price CHAR(1) DEFAULT 'N',
    allaw_r_sale CHAR(1) DEFAULT 'N',
    allaw_sale_credit CHAR(1) DEFAULT 'N',
    allaw_un_sale CHAR(1) DEFAULT 'N',
    allaw_sale_delivery CHAR(1) DEFAULT 'N',
    emp_show_money CHAR(1) DEFAULT 'N',
    emp_change_cash_disk CHAR(1) DEFAULT 'N',
    CONSTRAINT PK_Employee PRIMARY KEY CLUSTERED (emp_id)
);
`;
