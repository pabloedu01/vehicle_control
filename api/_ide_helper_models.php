<?php

// @formatter:off
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * App\Models\ChecklistItem
 *
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property string|null $code
 * @property bool $active
 * @property |null $validation
 * @property bool $is_default
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Log[] $logs
 * @property-read int|null $logs_count
 * @method static \Illuminate\Database\Eloquent\Builder|ChecklistItem newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ChecklistItem newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ChecklistItem query()
 * @method static \Illuminate\Database\Eloquent\Builder|ChecklistItem whereActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ChecklistItem whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ChecklistItem whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ChecklistItem whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ChecklistItem whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ChecklistItem whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ChecklistItem whereIsDefault($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ChecklistItem whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ChecklistItem whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ChecklistItem whereValidation($value)
 */
	class ChecklistItem extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\ClaimService
 *
 * @property int $id
 * @property int $company_id
 * @property int|null $integration_code
 * @property string $description
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Company $company
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Log[] $logs
 * @property-read int|null $logs_count
 * @method static \Illuminate\Database\Eloquent\Builder|ClaimService newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ClaimService newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ClaimService query()
 * @method static \Illuminate\Database\Eloquent\Builder|ClaimService whereCompanyId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ClaimService whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ClaimService whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ClaimService whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ClaimService whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ClaimService whereIntegrationCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ClaimService whereUpdatedAt($value)
 */
	class ClaimService extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\ClaimServiceServiceSchedule
 *
 * @property int $id
 * @property int $service_schedule_id
 * @property int $claim_service_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Log[] $logs
 * @property-read int|null $logs_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\ServiceClaimServiceServiceSchedule[] $services
 * @property-read int|null $services_count
 * @method static \Illuminate\Database\Eloquent\Builder|ClaimServiceServiceSchedule newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ClaimServiceServiceSchedule newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ClaimServiceServiceSchedule query()
 * @method static \Illuminate\Database\Eloquent\Builder|ClaimServiceServiceSchedule whereClaimServiceId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ClaimServiceServiceSchedule whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ClaimServiceServiceSchedule whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ClaimServiceServiceSchedule whereServiceScheduleId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ClaimServiceServiceSchedule whereUpdatedAt($value)
 */
	class ClaimServiceServiceSchedule extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\Client
 *
 * @property int $id
 * @property int $company_id
 * @property string $name
 * @property string $document
 * @property string $address
 * @property bool $active
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Company $company
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Log[] $logs
 * @property-read int|null $logs_count
 * @method static \Illuminate\Database\Eloquent\Builder|Client newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Client newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Client query()
 * @method static \Illuminate\Database\Eloquent\Builder|Client whereActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Client whereAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Client whereCompanyId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Client whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Client whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Client whereDocument($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Client whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Client whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Client whereUpdatedAt($value)
 */
	class Client extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\Company
 *
 * @property int $id
 * @property string|null $name
 * @property string|null $cnpj
 * @property string|null $cpf
 * @property string|null $country
 * @property string|null $city
 * @property string|null $province
 * @property string|null $address_1
 * @property string|null $address_2
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Log[] $logs
 * @property-read int|null $logs_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Product[] $products
 * @property-read int|null $products_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\User[] $users
 * @property-read int|null $users_count
 * @method static \Illuminate\Database\Eloquent\Builder|Company newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Company newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Company query()
 * @method static \Illuminate\Database\Eloquent\Builder|Company whereAddress1($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Company whereAddress2($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Company whereCity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Company whereCnpj($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Company whereCountry($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Company whereCpf($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Company whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Company whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Company whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Company whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Company whereProvince($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Company whereUpdatedAt($value)
 */
	class Company extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\Permission
 *
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property string $code
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Log[] $logs
 * @property-read int|null $logs_count
 * @method static \Illuminate\Database\Eloquent\Builder|Permission newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Permission newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Permission query()
 * @method static \Illuminate\Database\Eloquent\Builder|Permission whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Permission whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Permission whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Permission whereName($value)
 */
	class Permission extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\Product
 *
 * @property int $id
 * @property int $company_id
 * @property string $name
 * @property string $product_code
 * @property float $sale_value
 * @property float $guarantee_value
 * @property string|null $unique_code
 * @property bool $active
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Company $company
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Log[] $logs
 * @property-read int|null $logs_count
 * @method static \Illuminate\Database\Eloquent\Builder|Product newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Product newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Product query()
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereCompanyId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereGuaranteeValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereProductCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereSaleValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereUniqueCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Product whereUpdatedAt($value)
 */
	class Product extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\ProductServiceClaimServiceServiceSchedule
 *
 * @property int $id
 * @property int $service_claim_service_service_schedule_id
 * @property int $product_id
 * @property float $price
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Log[] $logs
 * @property-read int|null $logs_count
 * @method static \Illuminate\Database\Eloquent\Builder|ProductServiceClaimServiceServiceSchedule newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ProductServiceClaimServiceServiceSchedule newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ProductServiceClaimServiceServiceSchedule query()
 * @method static \Illuminate\Database\Eloquent\Builder|ProductServiceClaimServiceServiceSchedule whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ProductServiceClaimServiceServiceSchedule whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ProductServiceClaimServiceServiceSchedule wherePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ProductServiceClaimServiceServiceSchedule whereProductId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ProductServiceClaimServiceServiceSchedule whereServiceClaimServiceServiceScheduleId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ProductServiceClaimServiceServiceSchedule whereUpdatedAt($value)
 */
	class ProductServiceClaimServiceServiceSchedule extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\Service
 *
 * @property int $id
 * @property int $company_id
 * @property string $service_code
 * @property string|null $integration_code
 * @property string|null $description
 * @property float $standard_quantity
 * @property float $standard_value
 * @property bool $active
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Company $company
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Log[] $logs
 * @property-read int|null $logs_count
 * @method static \Illuminate\Database\Eloquent\Builder|Service newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Service newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Service query()
 * @method static \Illuminate\Database\Eloquent\Builder|Service whereActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Service whereCompanyId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Service whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Service whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Service whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Service whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Service whereIntegrationCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Service whereServiceCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Service whereStandardQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Service whereStandardValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Service whereUpdatedAt($value)
 */
	class Service extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\ServiceClaimServiceServiceSchedule
 *
 * @property int $id
 * @property int $claim_service_service_schedule_id
 * @property int $service_id
 * @property float $price
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Log[] $logs
 * @property-read int|null $logs_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\ProductServiceClaimServiceServiceSchedule[] $products
 * @property-read int|null $products_count
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceClaimServiceServiceSchedule newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceClaimServiceServiceSchedule newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceClaimServiceServiceSchedule query()
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceClaimServiceServiceSchedule whereClaimServiceServiceScheduleId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceClaimServiceServiceSchedule whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceClaimServiceServiceSchedule whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceClaimServiceServiceSchedule wherePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceClaimServiceServiceSchedule whereServiceId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceClaimServiceServiceSchedule whereUpdatedAt($value)
 */
	class ServiceClaimServiceServiceSchedule extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\ServiceSchedule
 *
 * @property int $id
 * @property int $company_id
 * @property int $vehicle_id
 * @property int|null $technical_consultant_id
 * @property int|null $client_id
 * @property string|null $code
 * @property string $promised_date
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\ClaimServiceServiceSchedule[] $claimsService
 * @property-read int|null $claims_service_count
 * @property-read \App\Models\Client|null $client
 * @property-read \App\Models\Company $company
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Log[] $logs
 * @property-read int|null $logs_count
 * @property-read \App\Models\TechnicalConsultant|null $technicalConsultant
 * @property-read \App\Models\Vehicle $vehicle
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceSchedule newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceSchedule newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceSchedule query()
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceSchedule whereClientId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceSchedule whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceSchedule whereCompanyId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceSchedule whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceSchedule whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceSchedule whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceSchedule wherePromisedDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceSchedule whereTechnicalConsultantId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceSchedule whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ServiceSchedule whereVehicleId($value)
 */
	class ServiceSchedule extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\TechnicalConsultant
 *
 * @property int $id
 * @property int $company_id
 * @property int $user_id
 * @property bool $active
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Company $company
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Log[] $logs
 * @property-read int|null $logs_count
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder|TechnicalConsultant newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TechnicalConsultant newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TechnicalConsultant query()
 * @method static \Illuminate\Database\Eloquent\Builder|TechnicalConsultant whereActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TechnicalConsultant whereCompanyId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TechnicalConsultant whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TechnicalConsultant whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TechnicalConsultant whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TechnicalConsultant whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TechnicalConsultant whereUserId($value)
 */
	class TechnicalConsultant extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\TireBrand
 *
 * @property int $id
 * @property int $company_id
 * @property string $name
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Company $company
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Log[] $logs
 * @property-read int|null $logs_count
 * @method static \Illuminate\Database\Eloquent\Builder|TireBrand newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TireBrand newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TireBrand query()
 * @method static \Illuminate\Database\Eloquent\Builder|TireBrand whereCompanyId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TireBrand whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TireBrand whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TireBrand whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TireBrand whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TireBrand whereUpdatedAt($value)
 */
	class TireBrand extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\Token
 *
 * @property int $id
 * @property int $user_id
 * @property string $token
 * @property string $from
 * @property string $type
 * @property string $date
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Log[] $logs
 * @property-read int|null $logs_count
 * @method static \Illuminate\Database\Eloquent\Builder|Token newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Token newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Token query()
 * @method static \Illuminate\Database\Eloquent\Builder|Token whereDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Token whereFrom($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Token whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Token whereToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Token whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Token whereUserId($value)
 */
	class Token extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\User
 *
 * @property int $id
 * @property int|null $user_id
 * @property string $username
 * @property $password
 * @property string $name
 * @property string $email
 * @property string|null $phone
 * @property string|null $birthday
 * @property bool $active
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Company[] $companies
 * @property-read int|null $companies_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Log[] $logs
 * @property-read int|null $logs_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\TechnicalConsultant[] $technicalConsultants
 * @property-read int|null $technical_consultants_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Token[] $tokens
 * @property-read int|null $tokens_count
 * @method static \Illuminate\Database\Eloquent\Builder|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User newQuery()
 * @method static \Illuminate\Database\Query\Builder|User onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|User query()
 * @method static \Illuminate\Database\Eloquent\Builder|User whereActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereBirthday($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereUsername($value)
 * @method static \Illuminate\Database\Query\Builder|User withTrashed()
 * @method static \Illuminate\Database\Query\Builder|User withoutTrashed()
 */
	class User extends \Eloquent implements \Tymon\JWTAuth\Contracts\JWTSubject {}
}

namespace App\Models{
/**
 * App\Models\UserVerificationCode
 *
 * @property int $id
 * @property int $user_id
 * @property string $code
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Log[] $logs
 * @property-read int|null $logs_count
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder|UserVerificationCode newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|UserVerificationCode newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|UserVerificationCode query()
 * @method static \Illuminate\Database\Eloquent\Builder|UserVerificationCode whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserVerificationCode whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserVerificationCode whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserVerificationCode whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserVerificationCode whereUserId($value)
 */
	class UserVerificationCode extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\Vehicle
 *
 * @property int $id
 * @property int $company_id
 * @property int $model_id
 * @property string $name
 * @property int $model_year
 * @property bool $active
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Company $company
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Log[] $logs
 * @property-read int|null $logs_count
 * @property-read \App\Models\VehicleModel $model
 * @method static \Illuminate\Database\Eloquent\Builder|Vehicle newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Vehicle newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Vehicle query()
 * @method static \Illuminate\Database\Eloquent\Builder|Vehicle whereActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Vehicle whereCompanyId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Vehicle whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Vehicle whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Vehicle whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Vehicle whereModelId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Vehicle whereModelYear($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Vehicle whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Vehicle whereUpdatedAt($value)
 */
	class Vehicle extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\VehicleBrand
 *
 * @property int $id
 * @property int $company_id
 * @property string $name
 * @property bool $active
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Company $company
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Log[] $logs
 * @property-read int|null $logs_count
 * @method static \Illuminate\Database\Eloquent\Builder|VehicleBrand newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|VehicleBrand newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|VehicleBrand query()
 * @method static \Illuminate\Database\Eloquent\Builder|VehicleBrand whereActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehicleBrand whereCompanyId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehicleBrand whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehicleBrand whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehicleBrand whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehicleBrand whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehicleBrand whereUpdatedAt($value)
 */
	class VehicleBrand extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\VehicleBrandChecklistVersion
 *
 * @property int $id
 * @property int $company_id
 * @property int $brand_id
 * @property string $code
 * @property string $name
 * @property string|null $description
 * @property bool $active
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\VehicleBrand $brand
 * @property-read \App\Models\Company $company
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\ChecklistItem[] $items
 * @property-read int|null $items_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Log[] $logs
 * @property-read int|null $logs_count
 * @method static \Illuminate\Database\Eloquent\Builder|VehicleBrandChecklistVersion newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|VehicleBrandChecklistVersion newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|VehicleBrandChecklistVersion query()
 * @method static \Illuminate\Database\Eloquent\Builder|VehicleBrandChecklistVersion version($version_id = null)
 * @method static \Illuminate\Database\Eloquent\Builder|VehicleBrandChecklistVersion whereActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehicleBrandChecklistVersion whereBrandId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehicleBrandChecklistVersion whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehicleBrandChecklistVersion whereCompanyId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehicleBrandChecklistVersion whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehicleBrandChecklistVersion whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehicleBrandChecklistVersion whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehicleBrandChecklistVersion whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehicleBrandChecklistVersion whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehicleBrandChecklistVersion whereUpdatedAt($value)
 */
	class VehicleBrandChecklistVersion extends \Eloquent {}
}

namespace App\Models{
/**
 * App\Models\VehicleModel
 *
 * @property int $id
 * @property int $company_id
 * @property int $brand_id
 * @property string $name
 * @property bool $active
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\VehicleBrand $brand
 * @property-read \App\Models\Company $company
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\Log[] $logs
 * @property-read int|null $logs_count
 * @method static \Illuminate\Database\Eloquent\Builder|VehicleModel newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|VehicleModel newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|VehicleModel query()
 * @method static \Illuminate\Database\Eloquent\Builder|VehicleModel whereActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehicleModel whereBrandId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehicleModel whereCompanyId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehicleModel whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehicleModel whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehicleModel whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehicleModel whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehicleModel whereUpdatedAt($value)
 */
	class VehicleModel extends \Eloquent {}
}

