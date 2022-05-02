<?php

namespace App\Rules;

use App\Models\ClaimService;
use App\Models\Product;
use App\Models\Service;
use Illuminate\Contracts\Validation\Rule;
use Illuminate\Support\Collection;

class ServiceClaimsOfServiceSchedule implements Rule
{
    private $company_id;
    private $message;

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct($company_id)
    {
        $this->company_id = $company_id;
        $this->message = trans('validation.serviceClaimsOfServiceSchedule');
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        $claimsService = $value;

        $claimServiceIds = [];
        $serviceIds = [];
        $productIds = [];
        $prices = [];

        foreach($claimsService as $claimService){
            if(isset($claimService['claim_service_id'])){
                $claimServiceIds[] = $claimService['claim_service_id'];

                if(isset($claimService['services']) && is_array($claimService['services'])){
                    foreach($claimService['services'] as $service){
                        if(isset($service['service_id'])){
                            $serviceIds[] = $service['service_id'];

                            $prices[] = $service['price'];

                            if(isset($service['products']) && is_array($service['products'])){
                                foreach($service['products'] as $product){
                                    if(isset($product['product_id'])){
                                        $productIds[] = $product['product_id'];

                                        $prices[] = $product['price'];
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        if(!$this->compareArrayWithDatabase(collect($claimServiceIds), ClaimService::class, $this->company_id)){
            //$this->message = '';
            return false;
        } else {
            if(!$this->compareArrayWithDatabase(collect($serviceIds), Service::class, $this->company_id)){
                //$this->message = '';
                return false;
            } else {
                if(!$this->compareArrayWithDatabase(collect($productIds), Product::class, $this->company_id)){
                    //$this->message = '';
                    return false;
                } else {
                    if(collect($prices)->filter(function($price){ return !is_numeric($price); })->count() > 0){
                        //$this->message = '';
                        return false;
                    }
                }
            }
        }

        return true;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return $this->message;
    }

    private function compareArrayWithDatabase(Collection $ids, $modelClass, $company_id){
        if($ids->count() > 0 && $ids->count() != $modelClass::where('company_id', '=', $company_id)
                                                            ->whereIn('id', $ids->toArray())
                                                            ->count()){
            return false;
        }

        return true;
    }
}
